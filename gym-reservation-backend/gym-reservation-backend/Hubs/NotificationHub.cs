using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
[Authorize]
public class NotificationHub : Hub
{
    public async Task JoinGroupByEmail(string email)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, email);
        Console.WriteLine($"User {Context.ConnectionId} joined group {email}");
    }

    public async Task LeaveGroupByEmail(string email)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, email);
        Console.WriteLine($"User {Context.ConnectionId} left group {email}");
    }
}
