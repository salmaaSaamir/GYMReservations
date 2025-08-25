using gym_reservation_backend.Models;
using gym_reservation_backend.Response;

namespace gym_reservation_backend.Interfaces
{
    public interface IUserService
    {
        Task<ServiceResponse> GetUserMenus(int userId);
        Task<ServiceResponse> GetUsers(int page = 1, int pageSize = 20);
        Task<ServiceResponse> UpsertUser(User user);
        Task<ServiceResponse> DeleteUser(int id);
        Task<ServiceResponse> GetSystemMenus();
        Task<ServiceResponse> SaveUserMenus(UserMenuRequest request);
        Task<ServiceResponse> GetUserImage(int userId);
    }
}
