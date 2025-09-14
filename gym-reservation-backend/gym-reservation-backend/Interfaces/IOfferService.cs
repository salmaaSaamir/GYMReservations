using gym_reservation_backend.Models;
using gym_reservation_backend.Response;

namespace gym_reservation_backend.Interfaces
{
    public interface IOfferService
    {
        Task<ServiceResponse> GetOffers(int page = 1, int pageSize = 20);
        Task<bool> Delete(int offerId);
        Task<ServiceResponse> Save(Offer offer);
        Task<ServiceResponse> GetLastOfferForWebsite();
        Task<ServiceResponse> GetGymStatsAsync();
    }
}
