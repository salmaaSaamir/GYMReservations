using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace gym_reservation_backend.Hubs
{
    [AllowAnonymous]

    public class NotificationHub : Hub
    {
        private readonly ILogger<NotificationHub> _logger;

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
            await base.OnDisconnectedAsync(exception);
        }

        public async Task JoinGroupByEmail(string email)
        {
            try
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, email);
                _logger.LogInformation($"User {Context.ConnectionId} joined group {email}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error joining group {email}");
                throw;
            }
        }

        public async Task LeaveGroupByEmail(string email)
        {
            try
            {
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, email);
                _logger.LogInformation($"User {Context.ConnectionId} left group {email}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error leaving group {email}");
                throw;
            }
        }
    }

}