using Microsoft.AspNetCore.SignalR;
using gym_reservation_backend.Interfaces;
using gym_reservation_backend.Models;
using gym_reservation_backend.Context;
using gym_reservation_backend.Hubs;

public class NotificationService : INotificationService
{
    private readonly IHubContext<NotificationHub> _hubContext;
    private readonly DBContext _context;

    public NotificationService(IHubContext<NotificationHub> hubContext, DBContext context)
    {
        _hubContext = hubContext;
        _context = context;
    }

    

}
