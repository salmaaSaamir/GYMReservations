using gym_reservation_backend.Models;
using gym_reservation_backend.Response;

namespace gym_reservation_backend.Interfaces
{
    public interface IAuthService
    {
        Task<ServiceResponse> Login(LoginModel model);
    }
}
