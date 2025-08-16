using gym_reservation_backend.Models;
using gym_reservation_backend.Response;

namespace gym_reservation_backend.Interfaces
{
    public interface ITrainerService
    {
        Task<ServiceResponse> GetTrainers(int page = 1, int pageSize = 20);
        Task<ServiceResponse> GetAllTrainers();
        Task<bool> Delete(int trainerId);
        Task<ServiceResponse> Save(Trainer trainer);
    }
}
