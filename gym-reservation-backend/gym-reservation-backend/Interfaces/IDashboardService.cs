using gym_reservation_backend.Models;

namespace gym_reservation_backend.Interfaces
{
    public interface IDashboardService
    {
        Task<DashboardDataDto> GetDashboardDataAsync();

    }
}
