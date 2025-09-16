using Microsoft.AspNetCore.SignalR;
using gym_reservation_backend.Interfaces;
using gym_reservation_backend.Models;
using gym_reservation_backend.Context;
using gym_reservation_backend.Hubs;
using Microsoft.EntityFrameworkCore;
using gym_reservation_backend.Response;

public class NotificationService : INotificationService
{
    private readonly IHubContext<NotificationHub> _hubContext;
    private readonly DBContext _context;
    private readonly ServiceResponse _response = new ServiceResponse();

    public NotificationService(IHubContext<NotificationHub> hubContext, DBContext context)
    {
        _hubContext = hubContext;
        _context = context;
    }

    public async Task<ServiceResponse> GetNotifications(string userEmail)
    {
        try
        {
            var notifications = await _context.Notifications
                .Where(n => n.userEmail == userEmail)
                .OrderByDescending(n => n.Date)
                .ToListAsync();

            _response.State = true;
            _response.Data.Add(notifications);
            return _response;
        }
        catch (Exception ex)
        {
            _response.State = false;
            _response.ErrorMessage = $"Error retrieving notifications: {ex.Message}";
            return _response;
        }
    }

    public async Task<ServiceResponse> MarkNotificationAsRead(int id)
    {
        try
        {
            var notification = await _context.Notifications.FindAsync(id);
            if (notification == null)
            {
                _response.State = false;
                _response.ErrorMessage = "Notification not found.";
                return _response;
            }

            notification.IsRead = true;
            await _context.SaveChangesAsync();

            _response.State = true;
            _response.SuccessMessage = "Notification marked as read.";
            return _response;
        }
        catch (Exception ex)
        {
            _response.State = false;
            _response.ErrorMessage = $"Error marking notification as read: {ex.Message}";
            return _response;
        }
    }

    public async Task<ServiceResponse> DeleteNotification(int id)
    {
        try
        {
            var notification = await _context.Notifications.FindAsync(id);
            if (notification == null)
            {
                _response.State = false;
                _response.ErrorMessage = "Notification not found.";
                return _response;
            }

            _context.Notifications.Remove(notification);
            await _context.SaveChangesAsync();

            _response.State = true;
            _response.SuccessMessage = "Notification deleted successfully.";
            return _response;
        }
        catch (Exception ex)
        {
            _response.State = false;
            _response.ErrorMessage = $"Error deleting notification: {ex.Message}";
            return _response;
        }
    }

    public async Task<ServiceResponse> MarkAllAsRead(string userEmail)
    {
        try
        {
            var notifications = await _context.Notifications
                .Where(n => n.userEmail == userEmail && !n.IsRead)
                .ToListAsync();

            notifications.ForEach(n => n.IsRead = true);
            await _context.SaveChangesAsync();

            _response.State = true;
            _response.SuccessMessage = "All notifications marked as read.";
            return _response;
        }
        catch (Exception ex)
        {
            _response.State = false;
            _response.ErrorMessage = $"Error marking all notifications as read: {ex.Message}";
            return _response;
        }
    }

    public async Task<ServiceResponse> DeleteAllNotifications(string userEmail)
    {
        try
        {
            var notifications = await _context.Notifications
                .Where(n => n.userEmail == userEmail)
                .ToListAsync();

            _context.Notifications.RemoveRange(notifications);
            await _context.SaveChangesAsync();

            _response.State = true;
            _response.SuccessMessage = "All notifications deleted successfully.";
            return _response;
        }
        catch (Exception ex)
        {
            _response.State = false;
            _response.ErrorMessage = $"Error deleting all notifications: {ex.Message}";
            return _response;
        }
    }
    public async Task SendCancellClassNotification(string userEmail,string message)
    {
        try
        {
            // 1. get all users
            var allUsers = _context.Users.Select(u => u.Email).ToList();

            // 2. for online users
            var onlineUsers = NotificationHub.GetUsersInGroup("GymAdminsGroup");

            var notifications = new List<Notification>();

            // 3. for all joined users
            foreach (var email in allUsers)
            {
                var notification= new Notification
                {
                    userEmail = email,
                    Message = message,
                    Type = "CancellClass",
                    Date = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"),
                    IsRead = false
                };
                _context.Notifications.Add(notification);

            }

            await _context.SaveChangesAsync();

            // 4. بعت إشعار بالـ SignalR للي أونلاين فقط
            if (onlineUsers.Any())
            {
                await _hubContext.Clients.Group("GymAdminsGroup").SendAsync("ReceiveNotification", new NotificationDto
                {
                    Title = "Class Cancelled",
                    Message = message,
                    Type = "CancellClass",
                    Date = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"),
                    IsRead = false
                });
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error sending cancellation notification: {ex.Message}");
        }
    }

    public async Task SendCompleteClassNotification(string usrEmail,string message)
    {
        try
        {
            // 1. get all users emails
            var allUsers = _context.Users.Select(u => u.Email).ToList();

            // 2. get joined emailes
            var onlineUsers = NotificationHub.GetUsersInGroup("GymAdminsGroup");

            var notifications = new List<Notification>();

            // 3. all the suers get notifcation
            foreach (var email in allUsers)
            {
                var notification = new Notification
                {
                    userEmail = email,
                    Message = message,
                    Type = "CompleteClass",
                    Date = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"),
                    IsRead = false
                };
                _context.Notifications.Add(notification);

            }

            await _context.SaveChangesAsync();

            // 4. for nline users
            if (onlineUsers.Any())
            {
                await _hubContext.Clients.Group("GymAdminsGroup").SendAsync("ReceiveNotification", new NotificationDto
                {
                    Title = "Class Completed",
                    Message = message,
                    Type = "CompleteClass",
                    Date = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"),
                    IsRead = false
                });
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error sending completion notification: {ex.Message}");
        }
    }



}