using gym_reservation_backend.Response;

namespace gym_reservation_backend.Interfaces
{
    public interface INotificationService
    {
        Task<ServiceResponse> GetNotifications(string useuserEmailrName);
        Task<ServiceResponse> MarkNotificationAsRead(int id);
        Task<ServiceResponse> DeleteNotification(int id);
        Task<ServiceResponse> MarkAllAsRead(string userEmail);
        Task<ServiceResponse> DeleteAllNotifications(string userEmail);
        Task SendCancellClassNotification(string userEmail, string message);
        Task SendCompleteClassNotification(string userEmail, string message);
    }
}
