using gym_reservation_backend.Models;
using gym_reservation_backend.Response;

namespace gym_reservation_backend.Interfaces
{
    public interface IMemberService
    {
        Task<ServiceResponse> GetMembers(int page = 1, int pageSize = 20);
        Task<ServiceResponse> GetAllMembers();
        Task<ServiceResponse> GetMemberSubscriptionHistory(int memberId);
        Task<ServiceResponse> GetActiveSubscription(int memberId);
        Task<ServiceResponse> FreezeSubscription(int memberId, int subscriptionHistoryId);
        Task<bool> Delete(int memberId);
        Task<ServiceResponse> Save(Member member);
    }
}
