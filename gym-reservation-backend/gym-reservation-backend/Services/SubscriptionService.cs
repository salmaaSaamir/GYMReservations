using gym_reservation_backend.Context;
using gym_reservation_backend.Interfaces;
using gym_reservation_backend.Models;
using gym_reservation_backend.Response;
using Microsoft.EntityFrameworkCore;

namespace gym_reservation_backend.Services
{
    public class SubscriptionService: ISubscriptionService
    {
        private readonly DBContext _dbContext;
        ServiceResponse _response = new ServiceResponse();

        public SubscriptionService(DBContext dbContext)
        {
            _dbContext = dbContext;
        }


        public async Task<ServiceResponse> GetSubscriptions(int page = 1, int pageSize = 20)
        {
            try
            {
                var query = _dbContext.Subscriptions.AsNoTracking(); // Faster read

                var total = await query.CountAsync();

                var subscriptions = await query
                    .OrderBy(u => u.Id)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();


                _response.State = true;
                _response.Data.Add(total);
                _response.Data.Add(page);
                _response.Data.Add(pageSize);
                _response.Data.Add(subscriptions);
            }
            catch (Exception ex)
            {
                _response.State = false;
                _response.ErrorMessage = $"Error retrieving subscriptions: {ex.Message}";
            }

            return _response;
        }
        public async Task<bool> Delete(int subscriptionsId)
        {
            if (IsExists(subscriptionsId))
            {
                var Subscription = await _dbContext.Subscriptions.FirstAsync(x => x.Id == subscriptionsId);

                _dbContext.Subscriptions.Remove(Subscription);
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
            return _dbContext.Subscriptions.Any(e => e.Id == id);
        }


        public async Task<ServiceResponse> Save(Subscription Subscription)
        {
            if (Subscription.Id == 0) // save
            {
                _dbContext.Subscriptions.Add(Subscription);
                await _dbContext.SaveChangesAsync();
            }
            else // update
            {
                _dbContext.Subscriptions.Update(Subscription);
                await _dbContext.SaveChangesAsync();
            }

            await _dbContext.SaveChangesAsync();
            _response.State = true;
            _response.Data.Add(Subscription);
            return _response;
        }
    }
}
