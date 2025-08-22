using gym_reservation_backend.Context;
using gym_reservation_backend.Interfaces;
using gym_reservation_backend.Models;
using gym_reservation_backend.Response;
using Hangfire;
using Microsoft.EntityFrameworkCore;

namespace gym_reservation_backend.Services
{
    public class MemberService : IMemberService
    {
        private readonly DBContext _dbContext;
        ServiceResponse _response = new ServiceResponse();
        private readonly IBackgroundJobClient _backgroundJobClient;

        public MemberService(DBContext dbContext, IBackgroundJobClient backgroundJobClient)
        {
            _dbContext = dbContext;
            _backgroundJobClient = backgroundJobClient;
        }

        public async Task<ServiceResponse> GetMembers(int page = 1, int pageSize = 20)
        {
            try
            {
                var query = _dbContext.Members.AsNoTracking(); // Faster read

                var total = await query.CountAsync();

                var members = await query
                    .OrderBy(u => u.Id)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                // Get last row IdCard
                var lastMemberIdCard = await _dbContext.Members
                    .OrderByDescending(t => t.Id)
                    .Select(t => t.IDCard)
                    .FirstOrDefaultAsync();

                _response.State = true;
                _response.Data.Add(total);
                _response.Data.Add(page);
                _response.Data.Add(pageSize);
                _response.Data.Add(members);
                _response.Data.Add(lastMemberIdCard ?? ""); // Add last IdCard
            }
            catch (Exception ex)
            {
                _response.State = false;
                _response.ErrorMessage = $"Error retrieving Members: {ex.Message}";
            }

            return _response;
        }

        public async Task<ServiceResponse> GetAllMembers()
        {
            try
            {
                var members = await _dbContext.Members.Where(x => x.Status == "Active").AsNoTracking().ToListAsync(); // Faster read
                _response.State = true;
                _response.Data.Add(members);
            }
            catch (Exception ex)
            {
                _response.State = false;
                _response.ErrorMessage = $"Error retrieving Members: {ex.Message}";
            }

            return _response;
        }
        public async Task<ServiceResponse> GetMemberSubscriptionHistory(int memberId)
        {
            try
            {
                var subscriptionHistory = await _dbContext.MemberSubscriptions
                    .AsNoTracking()
                    .Where(ms => ms.MemberId == memberId)
                    .Include(ms => ms.Subscription)
                    .OrderByDescending(ms => ms.StartDate)
                    .Select(ms => new
                    {
                        ms.Id,
                        ms.MemberId,
                        ms.SubscriptionId,
                        SubscriptionName = ms.Subscription.Name,
                        SubscriptionPrice = ms.Subscription.Price,
                        ms.StartDate,
                        ms.EndDate,
                        ms.Status,
                        ms.RemainingFreezeDays,
                        ms.FreezeStartDate,
                        ms.FreezeEndDate,
                        DurationDays = (ms.EndDate - ms.StartDate).Days
                    })
                    .ToListAsync();

                _response.State = true;
                _response.Data.Add(subscriptionHistory);
            }
            catch (Exception ex)
            {
                _response.State = false;
                _response.ErrorMessage = $"Error retrieving subscription history: {ex.Message}";
            }

            return _response;
        }

        public async Task<bool> Delete(int memberId)
        {
            if (IsExists(memberId))
            {
                var member = await _dbContext.Members.FirstAsync(x => x.Id == memberId);
                _dbContext.Members.Remove(member);
                await _dbContext.SaveChangesAsync();
                return true;
            }
            else
            {
                return false;
            }
        }

        private bool IsExists(int id)
        {
            return _dbContext.Members.Any(e => e.Id == id);
        }

        public async Task<ServiceResponse> Save(Member member)
        {
            using var transaction = await _dbContext.Database.BeginTransactionAsync();

            try
            {
                if (member.Id == 0) // New member
                {
                    // Set default status for new member
                    member.Status = "Active";
                    _dbContext.Members.Add(member);
                    await _dbContext.SaveChangesAsync();

                    // Create subscription history entry for new member
                    if (member.CurrentSubscriptionId > 0)
                    {
                        var memberSubscription = await CreateMemberSubscription(member.Id, member.CurrentSubscriptionId);

                        // Schedule expiration check for the new subscription
                        ScheduleExpirationCheck(memberSubscription.Id, memberSubscription.EndDate);
                    }
                }
                else // Update existing member
                {
                    var existingMember = await _dbContext.Members
                        .FirstOrDefaultAsync(m => m.Id == member.Id);

                    if (existingMember == null)
                    {
                        _response.State = false;
                        _response.ErrorMessage = "Member not found";
                        return _response;
                    }

                    // Check if subscription changed
                    bool subscriptionChanged = existingMember.CurrentSubscriptionId != member.CurrentSubscriptionId;

                    // Update member properties
                    existingMember.Name = member.Name;
                    existingMember.Email = member.Email;
                    existingMember.Phone = member.Phone;
                    existingMember.IDCard = member.IDCard;
                    existingMember.CurrentSubscriptionId = member.CurrentSubscriptionId;
                    // Create new subscription history entry if subscription changed
                    if (subscriptionChanged && member.CurrentSubscriptionId > 0)
                    {
                        var memberSubscription = await CreateMemberSubscription(member.Id, member.CurrentSubscriptionId);

                        // Schedule expiration check for the new subscription
                        ScheduleExpirationCheck(memberSubscription.Id, memberSubscription.EndDate);
                    }
                    // Update member status based on subscription
                    if ( member.CurrentSubscriptionId > 0)
                    {
                        var subscriptionStatus = await GetActiveSubscriptionStatus(member.Id);
                        existingMember.Status = subscriptionStatus.Status;
                    }
                    else
                    {
                        existingMember.Status = "Inactive";
                    }

                    _dbContext.Members.Update(existingMember);
                    await _dbContext.SaveChangesAsync();

                   
                }

                await transaction.CommitAsync();
                _response.State = true;
                _response.Data.Add(member);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _response.State = false;
                _response.ErrorMessage = $"Error saving member: {ex.Message}";
            }

            return _response;
        }

        private async Task<MemberSubscription> CreateMemberSubscription(int memberId, int subscriptionId)
        {
            var subscription = await _dbContext.Subscriptions
                .FirstOrDefaultAsync(s => s.Id == subscriptionId);

            if (subscription != null)
            {
                var memberSubscription = new MemberSubscription
                {
                    MemberId = memberId,
                    SubscriptionId = subscriptionId,
                    StartDate = DateTime.Now,
                    EndDate = DateTime.Now.AddMonths(subscription.MonthsNo),
                    Status = "Active",
                    RemainingFreezeDays = subscription.FreezeDays
                };

                _dbContext.MemberSubscriptions.Add(memberSubscription);
                await _dbContext.SaveChangesAsync();

                return memberSubscription;
            }

            return null;
        }

        public async Task<ServiceResponse> FreezeSubscription(int memberId, int subscriptionHistoryId)
        {
            using var transaction = await _dbContext.Database.BeginTransactionAsync();

            try
            {
                // Get the subscription history entry
                var memberSubscription = await _dbContext.MemberSubscriptions
                    .FirstOrDefaultAsync(ms => ms.Id == subscriptionHistoryId && ms.MemberId == memberId);

                if (memberSubscription == null)
                {
                    _response.State = false;
                    _response.ErrorMessage = "Subscription history not found";
                    return _response;
                }

                // Check if there are remaining freeze days
                if (memberSubscription.RemainingFreezeDays == null || memberSubscription.RemainingFreezeDays <= 0)
                {
                    _response.State = false;
                    _response.ErrorMessage = "No remaining freeze days available";
                    return _response;
                }

                // Get the subscription
                var subscription = await _dbContext.Subscriptions
                    .FirstOrDefaultAsync(s => s.Id == memberSubscription.SubscriptionId);

                if (subscription == null)
                {
                    _response.State = false;
                    _response.ErrorMessage = "Subscription not found";
                    return _response;
                }

                var freezeDays = Math.Min(memberSubscription.RemainingFreezeDays.Value, subscription.FreezeDays ?? 0);

                // Update freeze tracking
                memberSubscription.RemainingFreezeDays -= freezeDays;
                memberSubscription.FreezeStartDate = DateTime.Now;
                memberSubscription.FreezeEndDate = DateTime.Now.AddDays(freezeDays);
                memberSubscription.Status = "Frozen";

                // Update member status to match subscription status
                var member = await _dbContext.Members.FirstOrDefaultAsync(m => m.Id == memberId);
                if (member != null)
                {
                    member.Status = "Frozen";
                    _dbContext.Members.Update(member);
                }

                _dbContext.MemberSubscriptions.Update(memberSubscription);
                await _dbContext.SaveChangesAsync();

                // Schedule automatic reactivation after freeze period
                _backgroundJobClient.Schedule(() =>
                    ReactivateSubscriptionAfterFreeze(memberSubscription.Id),
                    TimeSpan.FromDays(freezeDays));

                await transaction.CommitAsync();

                _response.State = true;
                _response.Data.Add(new
                {
                    Message = $"Subscription frozen successfully for {freezeDays} days.",
                    FreezeEndDate = memberSubscription.FreezeEndDate,
                    RemainingFreezeDays = memberSubscription.RemainingFreezeDays
                });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _response.State = false;
                _response.ErrorMessage = $"Error freezing subscription: {ex.Message}";
            }

            return _response;
        }

        [AutomaticRetry(Attempts = 3)]
        public async Task ReactivateSubscriptionAfterFreeze(int memberSubscriptionId)
        {
            using var transaction = await _dbContext.Database.BeginTransactionAsync();

            try
            {
                var memberSubscription = await _dbContext.MemberSubscriptions
                    .FirstOrDefaultAsync(ms => ms.Id == memberSubscriptionId);

                if (memberSubscription != null && memberSubscription.Status == "Frozen")
                {
                    // Check if subscription is expired
                    if (memberSubscription.EndDate <= DateTime.Now)
                    {
                        memberSubscription.Status = "Expired";
                    }
                    else
                    {
                        memberSubscription.Status = "Active";
                    }

                    memberSubscription.FreezeStartDate = null;
                    memberSubscription.FreezeEndDate = null;

                    _dbContext.MemberSubscriptions.Update(memberSubscription);

                    // Update member status to match subscription status
                    var member = await _dbContext.Members
                        .FirstOrDefaultAsync(m => m.Id == memberSubscription.MemberId);
                    if (member != null)
                    {
                        member.Status = memberSubscription.Status;
                        _dbContext.Members.Update(member);
                    }

                    await _dbContext.SaveChangesAsync();

                    // Schedule expiration check if subscription is active
                    if (memberSubscription.Status == "Active")
                    {
                        ScheduleExpirationCheck(memberSubscription.Id, memberSubscription.EndDate);
                    }

                    await transaction.CommitAsync();

                    Console.WriteLine($"Subscription {memberSubscriptionId} reactivated after freeze period.");
                }
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                Console.WriteLine($"Error reactivating subscription: {ex.Message}");
                throw;
            }
        }

        [AutomaticRetry(Attempts = 3)]
        public async Task CheckAndExpireSubscription(int memberSubscriptionId)
        {
            using var transaction = await _dbContext.Database.BeginTransactionAsync();

            try
            {
                var memberSubscription = await _dbContext.MemberSubscriptions
                    .FirstOrDefaultAsync(ms => ms.Id == memberSubscriptionId);

                if (memberSubscription != null &&
                    memberSubscription.EndDate <= DateTime.Now &&
                    memberSubscription.Status != "Expired")
                {
                    memberSubscription.Status = "Expired";
                    _dbContext.MemberSubscriptions.Update(memberSubscription);

                    // Update member status to expired
                    var member = await _dbContext.Members
                        .FirstOrDefaultAsync(m => m.Id == memberSubscription.MemberId);
                    if (member != null)
                    {
                        member.Status = "Expired";
                        _dbContext.Members.Update(member);
                    }

                    await _dbContext.SaveChangesAsync();
                    await transaction.CommitAsync();

                    Console.WriteLine($"Subscription {memberSubscriptionId} expired automatically.");
                }
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                Console.WriteLine($"Error expiring subscription: {ex.Message}");
                throw;
            }
        }

        private void ScheduleExpirationCheck(int memberSubscriptionId, DateTime endDate)
        {
            var timeUntilExpiration = endDate - DateTime.Now;

            if (timeUntilExpiration > TimeSpan.Zero)
            {
                _backgroundJobClient.Schedule(() =>
                    CheckAndExpireSubscription(memberSubscriptionId),
                    timeUntilExpiration);
            }
            else
            {
                // If already expired, update status immediately
                CheckAndExpireSubscription(memberSubscriptionId).Wait();
            }
        }

        public async Task<ServiceResponse> GetActiveSubscription(int memberId)
        {
            try
            {
                var activeSubscription = await _dbContext.MemberSubscriptions
                    .AsNoTracking()
                    .Where(ms => ms.MemberId == memberId && (ms.Status == "Active" || ms.Status == "Frozen") && ms.EndDate >= DateTime.Now)
                    .Include(ms => ms.Subscription)
                    .OrderByDescending(ms => ms.StartDate)
                    .Select(ms => new
                    {
                        ms.Id,
                        ms.SubscriptionId,
                        SubscriptionName = ms.Subscription.Name,
                        SubscriptionPrice = ms.Subscription.Price,
                        ms.StartDate,
                        ms.EndDate,
                        ms.Status,
                        RemainingDays = (ms.EndDate - DateTime.Now).Days,
                        RemainingFreezeDays = ms.RemainingFreezeDays,
                        CanFreeze = ms.RemainingFreezeDays > 0
                    })
                    .FirstOrDefaultAsync();

                _response.State = true;
                _response.Data.Add(activeSubscription ?? (object)"No active subscription found");
            }
            catch (Exception ex)
            {
                _response.State = false;
                _response.ErrorMessage = $"Error retrieving active subscription: {ex.Message}";
            }

            return _response;
        }

        // Helper method to get subscription status
        private async Task<MemberSubscription> GetActiveSubscriptionStatus(int memberId)
        {
            return await _dbContext.MemberSubscriptions
                .Where(ms => ms.MemberId == memberId)
                .OrderByDescending(ms => ms.StartDate)
                .FirstOrDefaultAsync();
        }

        // Add this method to initialize expiration checks on application start
        public void InitializeSubscriptionExpirationChecks()
        {
            var activeSubscriptions = _dbContext.MemberSubscriptions
                .Where(ms => (ms.Status == "Active" || ms.Status == "Frozen") && ms.EndDate > DateTime.Now)
                .ToList();

            foreach (var subscription in activeSubscriptions)
            {
                ScheduleExpirationCheck(subscription.Id, subscription.EndDate);
            }
        }
    }
}