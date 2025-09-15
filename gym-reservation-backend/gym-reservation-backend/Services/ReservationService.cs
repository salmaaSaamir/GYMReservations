using gym_reservation_backend.Context;
using gym_reservation_backend.Interfaces;
using gym_reservation_backend.Models;
using gym_reservation_backend.Response;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace gym_reservation_backend.Services
{
    public class ReservationService : IReservationService
    {
        private readonly DBContext _dbContext;
        ServiceResponse _response = new ServiceResponse();
        private readonly INotificationService _notificationService;

        public ReservationService(DBContext dbContext, INotificationService notificationService)
        {
            _dbContext = dbContext;
            _notificationService = notificationService;
        }

        public async Task<ServiceResponse> GetReservations(int page = 1, int pageSize = 20)
        {
            try
            {
                var query = _dbContext.Reservations
                    .Include(x => x.Member)
                    .Include(x => x.Class)
                        .ThenInclude(x => x.Trainer)
                    .AsNoTracking();

                var total = await query.CountAsync();

                var reservations = await query
                    .OrderBy(u => u.Id)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(r => new ReservationDto
                    {
                        Id = r.Id,
                        ClassName = r.Class.Name,
                        ClassTime = r.Class.ClassTime,
                        MemberName = r.Member.Name,
                        MemberID = r.Member.IDCard,
                        TrainerName = r.Class.Trainer.Name,
                    })
                    .ToListAsync();

                _response.State = true;
                _response.Data.Add(total);
                _response.Data.Add(page);
                _response.Data.Add(pageSize);
                _response.Data.Add(reservations);
            }
            catch (Exception ex)
            {
                _response.State = false;
                _response.ErrorMessage = $"Error retrieving Reservations: {ex.Message}";
            }
            return _response;
        }
 
        public async Task<bool> Delete(int ReservationId)
        {
            if (IsExists(ReservationId))
            {
                var Reservation = await _dbContext.Reservations.FirstAsync(x => x.Id == ReservationId);
                _dbContext.Reservations.Remove(Reservation);
                await _dbContext.SaveChangesAsync();
                return true;
            }
            return false;
        }

        private bool IsExists(int id)
        {
            return _dbContext.Reservations.Any(e => e.Id == id);
        }


        public async Task<ServiceResponse> CheckClassAvailability(int classId)
        {
            try
            {
                var classInfo = await _dbContext.Classes
                    .Include(c => c.Reservations)
                    .FirstOrDefaultAsync(c => c.Id == classId);

                if (classInfo == null)
                {
                    _response.State = false;
                    _response.ErrorMessage = "Class not found";
                    return _response;
                }

                var isFull = classInfo.Reservations.Count >= classInfo.ClassLimit;
                var availableSlots = classInfo.ClassLimit - classInfo.Reservations.Count;

                _response.State = true;
                _response.Data.Add(new
                {
                    IsAvailable = !isFull,
                    AvailableSlots = availableSlots,
                    TotalSlots = classInfo.ClassLimit,
                    IsFull = isFull
                });
                return _response;
            }
            catch (Exception ex)
            {
                _response.State = false;
                _response.ErrorMessage = $"Error checking class availability: {ex.Message}";
                return _response;
            }
        }

        public async Task<ServiceResponse> CheckMemberReservation(int classId,int memberId, string classDay)
        {
            try
            {
                var existingReservation = await _dbContext.Reservations
                    .Include(r => r.Class).AsNoTracking()
                    .FirstOrDefaultAsync(r => r.MemberId == memberId &&
                                            r.ClassId == classId &&
                                            r.Class.ClassDay == classDay);
                if (existingReservation != null)
                {
                    _response.State = true;
                    return _response;


                }
                _response.State = false;

                return _response;
            }
            catch (Exception ex)
            {
                _response.State = false;
                _response.ErrorMessage = $"Error checking member reservation: {ex.Message}";
                return _response;
            }
        }

        // Simplified Save method
        public async Task<ServiceResponse> SaveReservation(Reservation reservation,string? email)
        {
            try
            {
                if (reservation.Id == 0)
                {
                    _dbContext.Reservations.Add(reservation);
                }
                else
                {
                    _dbContext.Reservations.Update(reservation);
                }

                await _dbContext.SaveChangesAsync();
                if (email != null)
                {
                    // ✅ After saving, check if class completion limit is reached
                    await CheckClassCompletion(reservation.ClassId, email);
                }
 

                // Return minimal data to avoid circular references
                _response.State = true;
                _response.Data.Add(reservation);
                return _response;
            }
            catch (Exception ex)
            {
                _response.State = false;
                _response.ErrorMessage = $"Error saving Reservation: {ex.Message}";
                return _response;
            }
        }

        private async Task<ServiceResponse> CheckClassCompletion(int classId,string email)
        {
            try
            {
                // Get class info (assuming you have a Class or Course entity with Capacity/Limit)
                var classEntity = await _dbContext.Classes.AsNoTracking()
                    .FirstOrDefaultAsync(c => c.Id == classId);

                if (classEntity == null)
                {
                    _response.State = false;
                    _response.ErrorMessage = "Class not found.";
                    return _response;
                }

                // Count current reservations for this class
                int reservationCount = await _dbContext.Reservations
                    .CountAsync(r => r.ClassId == classId);

                if (reservationCount >= classEntity.ClassLimit) // assuming Capacity is the limit
                {
                    // Class is full → send notifications
                    string message = $"Class {classEntity.Name} is now fully booked.";

                    _notificationService.SendCompleteClassNotification(email, message);


                    _response.State = true;
                    _response.Data.Add(new { ClassId = classId, Completed = true });
                }
                else
                {
                    _response.State = true;
                    _response.Data.Add(new { ClassId = classId, Completed = false });
                }

                return _response;
            }
            catch (Exception ex)
            {
                _response.State = false;
                _response.ErrorMessage = $"Error checking class completion: {ex.Message}";
                return _response;
            }
        }


    }
}