using gym_reservation_backend.Models;
using gym_reservation_backend.Response;

namespace gym_reservation_backend.Interfaces
{
    public interface IContactService
    {
        Task<ServiceResponse> GetContacts(int page = 1, int pageSize = 20);
        Task<bool> Delete(int contactId);
        Task<ServiceResponse> Save(ContactUs contact);
        Task<ServiceResponse> ResponseByEmail(ContactUs contact);
    }
}
