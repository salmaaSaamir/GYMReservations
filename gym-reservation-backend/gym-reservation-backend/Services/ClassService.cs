using gym_reservation_backend.Context;
using gym_reservation_backend.Interfaces;
using gym_reservation_backend.Models;
using gym_reservation_backend.Response;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace gym_reservation_backend.Services
{
    public class ClassService : IClassService
    {
        private readonly DBContext _dbContext;
        ServiceResponse _response = new ServiceResponse();
        private readonly INotificationService _notificationService;
        public ClassService(DBContext dbContext, INotificationService notificationService)
        {
            _dbContext = dbContext;
            _notificationService = notificationService;
        }

        public async Task<ServiceResponse> GetClasses(int page = 1, int pageSize = 20)
        {

            try
            {
                var query = _dbContext.Classes.Include(x=>x.Trainer).AsNoTracking(); // Faster read, no change tracking

                var total = await query.CountAsync();
                var classes = await query
                    .OrderBy(u => u.Id)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                _response.State = true;
                _response.Data.Add(total);
                _response.Data.Add(page);
                _response.Data.Add(pageSize);
                _response.Data.Add(classes);

            }
            catch (Exception ex)
            {
                _response.State = false;
                _response.ErrorMessage = $"Error retrieving Class: {ex.Message}";
            }
            return _response;
        }
        public async Task<ServiceResponse> GetAllClasses()
        {
            try
            {
                // Get today's date in the format "yyyy-MM-dd"
                var today = DateTime.Now.ToString("yyyy-MM-dd");

                var classes = await _dbContext.Classes
                    .Where(x => !x.IsCancelled && x.ClassDay == today)
                    .AsNoTracking()
                    .ToListAsync(); // Faster read, no change tracking

                _response.State = true;
                _response.Data.Add(classes);
            }
            catch (Exception ex)
            {
                _response.State = false;
                _response.ErrorMessage = $"Error retrieving Class: {ex.Message}";
            }
            return _response;
        }
        public async Task<ServiceResponse> CheckClassConflict(string classDay, string classTime)
        {
            try
            {
                // First parse the input time outside the query
                if (!TimeSpan.TryParse(classTime, out var newClassTime))
                {
                    _response.State = false;
                    _response.ErrorMessage = "Invalid time format";
                    return _response;
                }

                var newClassStart = newClassTime;
                var newClassEnd = newClassStart.Add(TimeSpan.FromHours(1));

                // Get all classes for the day first
                var classesOnDay = await _dbContext.Classes
                    .AsNoTracking()
                    .Where(c => c.ClassDay == classDay && !c.IsCancelled)
                    .ToListAsync();

                // Then check for conflicts in memory
                var hasConflict = classesOnDay.Any(c =>
                {
                    if (TimeSpan.TryParse(c.ClassTime, out var existingClassTime))
                    {
                        var existingClassEnd = existingClassTime.Add(TimeSpan.FromHours(1));
                        return newClassStart < existingClassEnd && newClassEnd > existingClassTime;
                    }
                    return false;
                });

                _response.State = true;
                _response.Data.Add(hasConflict);
                return _response;
            }
            catch (Exception ex)
            {
                _response.State = false;
                _response.ErrorMessage = $"Error checking class conflict: {ex.Message}";
                return _response;
            }
        }

        public async Task<ServiceResponse> GetClassReservations(int classId)
        {
            try
            {
                var reservations = await _dbContext.Reservations
                    .Where(r => r.ClassId == classId).Select(x=>new {
                        x.Member.Name,
                        x.Member.IDCard,
                       
                    })

                    
                    .AsNoTracking() // Important for read-only operations
                    .ToListAsync();

                _response.State = true;
                _response.Data.Add(reservations);
                return _response;
            }
            catch (Exception ex)
            {
                _response.State = false;
                _response.ErrorMessage = $"Error retrieving class reservations: {ex.Message}";
                return _response;
            }
        }

        public async Task<bool> Delete(int classId)
        {
            if (IsExists(classId))
            {
                var classToDelete = await _dbContext.Classes.FirstAsync(x => x.Id == classId);
                _dbContext.Classes.Remove(classToDelete);
                await _dbContext.SaveChangesAsync();
                return true;
            }
            return false;
        }

        private bool IsExists(int id)
        {
            return _dbContext.Classes.Any(e => e.Id == id);
        }

        public async Task<ServiceResponse> Save(Classes classToSave)
        {
            try
            {
                if (classToSave.Id == 0) // save
                {
                    _dbContext.Classes.Add(classToSave);
                }
                else // update
                {
                    _dbContext.Classes.Update(classToSave);
                }

                await _dbContext.SaveChangesAsync();
                _response.State = true;
                _response.Data.Add(classToSave);
                return _response;
            }
            catch (Exception ex)
            {
                _response.State = false;
                _response.ErrorMessage = $"Error saving class: {ex.Message}";
                return _response;
            }
        }

        public async Task<ServiceResponse> CancelClass(int classId,string email)
        {
            try
            {

                var classToCancel = await _dbContext.Classes.FindAsync(classId);
                if (classToCancel == null)
                {
                    _response.State = false;
                    _response.ErrorMessage = "Class not found";
                    return _response;
                }

                classToCancel.IsCancelled = true;
                await _dbContext.SaveChangesAsync();
                string message = $"Class {classToCancel.Name} is now Cancelled.";

                 await _notificationService.SendCancellClassNotification(email, message);

                _response.State = true;
                return _response;
            }
            catch (Exception ex)
            {
                _response.State = false;
                _response.ErrorMessage = $"Error cancelling class: {ex.Message}";
                return _response;
            }
        }


        public async Task<ServiceResponse> GetWeeklySchedule(DateTime? date = null)
        {
            try
            {
                // Use current date if none provided
                var referenceDate = date ?? DateTime.Today;

                // Find the most recent Saturday (or today if it's Saturday)
                var startDate = referenceDate;
                while (startDate.DayOfWeek != DayOfWeek.Saturday)
                {
                    startDate = startDate.AddDays(-1);
                }

                // Calculate the end date (next Friday)
                var endDate = startDate.AddDays(6);

                // Format dates to match your string format
                string startDateStr = startDate.ToString("yyyy-MM-dd");
                string endDateStr = endDate.ToString("yyyy-MM-dd");

                // Get classes within this date range using string comparison
                var classes = await _dbContext.Classes
                    .Include(c => c.Trainer)
                    .Where(c => string.Compare(c.ClassDay, startDateStr) >= 0 &&
                                string.Compare(c.ClassDay, endDateStr) <= 0 &&
                                !c.IsCancelled)
                    .OrderBy(c => c.ClassDay)
                    .ThenBy(c => c.ClassTime)
                    .ToListAsync();

                _response.State = true;
                _response.Data.Add(startDate);
                _response.Data.Add(endDate);
                _response.Data.Add(classes);
                return _response;
            }
            catch (Exception ex)
            {
                _response.State = false;
                _response.ErrorMessage = ex.Message;
                return _response;
            }
        }
    }
}