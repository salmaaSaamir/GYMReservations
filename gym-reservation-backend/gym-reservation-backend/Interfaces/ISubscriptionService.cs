using gym_reservation_backend.Models;
using gym_reservation_backend.Response;

namespace gym_reservation_backend.Interfaces
{
    public interface ISubscriptionService
    {
        Task<ServiceResponse> GetSubscriptions(int page = 1, int pageSize = 20);
        Task<ServiceResponse> Save(Subscription subscription);
        Task<bool> Delete(int subscriptionId);
    }
}
