using Azure;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using gym_reservation_backend.Interfaces;

namespace gym_reservation_backend.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class NotificationsController : ControllerBase
    {
        private readonly INotificationService _notificationService;

        public NotificationsController(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        // ✅ POST: api/Notifications/notifications - Get user notifications
        [HttpGet("{model}")]
        public async Task<ActionResult> GetNotifications(string model)
        {
            var res = await _notificationService.GetNotifications(model);
            return Ok(JsonConvert.SerializeObject(res));
        }

        // ✅ GET: api/Notifications/read/{id} - Mark notification as read
        [HttpGet("{id}")]
        public async Task<IActionResult> MarkNotificationAsRead(int id)
        {
            var res = await _notificationService.MarkNotificationAsRead(id);
            return Ok(JsonConvert.SerializeObject(res));
        }

        // ✅ GET: api/Notifications/delete/{id} - Delete notification
        [HttpGet("{id}")]
        public async Task<IActionResult> DeleteNotification(int id)
        {
            var res = await _notificationService.DeleteNotification(id);
            return Ok(JsonConvert.SerializeObject(res));
        }

        // ✅ POST: api/Notifications/read-all - Mark all notifications as read
        [HttpGet("{model}")]
        public async Task<IActionResult> MarkAllAsRead(string model)
        {
            var res = await _notificationService.MarkAllAsRead(model);
            return Ok(JsonConvert.SerializeObject(res));
        }

        // ✅ POST: api/Notifications/delete-all - Delete all notifications
        [HttpGet("{model}")]
        public async Task<IActionResult> DeleteAllNotifications(string model)
        {
            var res = await _notificationService.DeleteAllNotifications(model);
            return Ok(JsonConvert.SerializeObject(res));
        }
    }
}