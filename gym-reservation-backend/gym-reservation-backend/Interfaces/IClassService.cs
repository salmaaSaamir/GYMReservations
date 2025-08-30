using gym_reservation_backend.Models;
using gym_reservation_backend.Response;

namespace gym_reservation_backend.Interfaces
{
    public interface IClassService
    {
        Task<ServiceResponse> GetClasses(int page = 1, int pageSize = 20);
        Task<ServiceResponse> CheckClassConflict(string classDay, string classTime);
        Task<ServiceResponse> GetClassReservations(int classId);
        Task<bool> Delete(int classId);
        Task<ServiceResponse> Save(Classes classToSave);
        Task<ServiceResponse> CancelClass(int classId,string email);

        Task<ServiceResponse> GetWeeklySchedule(DateTime? date = null);
        Task<ServiceResponse> GetAllClasses();

    }
}
