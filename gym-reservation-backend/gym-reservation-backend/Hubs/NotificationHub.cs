using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;

namespace gym_reservation_backend.Hubs
{
    [AllowAnonymous]
    public class NotificationHub : Hub
    {
        private readonly ILogger<NotificationHub> _logger;

        // Dictionary: classId -> list of user emails
        private static readonly ConcurrentDictionary<string, HashSet<string>> GroupUsers
            = new ConcurrentDictionary<string, HashSet<string>>();

        public NotificationHub(ILogger<NotificationHub> logger)
        {
            _logger = logger;
        }

        public override async Task OnConnectedAsync()
        {
            _logger.LogInformation($"Client connected: {Context.ConnectionId}");
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            _logger.LogInformation($"Client disconnected: {Context.ConnectionId}");

            // ممكن هنا تشيلي اليوزر من كل الجروبات اللي كان فيها لو عندك Tracking بالـ ConnectionId
            await base.OnDisconnectedAsync(exception);
        }

        // user joins a group by classId
        public async Task JoinGroupByClass(string classId, string email)
        {
            try
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, classId);

                // Add email to the dictionary
                var users = GroupUsers.GetOrAdd(classId, _ => new HashSet<string>());
                lock (users) // HashSet مش thread-safe
                {
                    users.Add(email);
                }

                _logger.LogInformation($"User {email} ({Context.ConnectionId}) joined group {classId}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error joining group {classId}");
                throw;
            }
        }

        public async Task LeaveGroupByClass(string classId, string email)
        {
            try
            {
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, classId);

                if (GroupUsers.TryGetValue(classId, out var users))
                {
                    lock (users)
                    {
                        users.Remove(email);
                    }
                }

                _logger.LogInformation($"User {email} ({Context.ConnectionId}) left group {classId}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error leaving group {classId}");
                throw;
            }
        }

        // Helper method to get all users in a class group
        public static List<string> GetUsersInGroup(string classId)
        {
            if (GroupUsers.TryGetValue(classId, out var users))
            {
                lock (users)
                {
                    return users.ToList();
                }
            }
            return new List<string>();
        }
    }
}
