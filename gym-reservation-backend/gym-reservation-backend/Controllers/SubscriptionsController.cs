using gym_reservation_backend.Interfaces;
using gym_reservation_backend.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace gym_reservation_backend.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class SubscriptionsController : ControllerBase
    {
        private readonly ISubscriptionService _subsc;

        public SubscriptionsController(ISubscriptionService subsc)
        {
            _subsc = subsc;
        }
        // GET: api/Subscriptions/GetSubscriptions?page=1&pageSize=20
        [HttpGet]
        public async Task<IActionResult> GetSubscriptions([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var res = await _subsc.GetSubscriptions(page, pageSize);
            return Ok(JsonConvert.SerializeObject(res));
        }
        
        // POST: api/Subscriptions/SaveTrainer
        // Will Add if Id == 0, Update otherwise
        [HttpPost]
        public async Task<IActionResult> SaveSubscription([FromBody] Subscription subscription)
        {
            var res = await _subsc.Save(subscription);
            return Ok(JsonConvert.SerializeObject(res));
        }

        // DELETE: api/Subscriptions/DeleteSubscription/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSubscription(int id)
        {
            var res = await _subsc.Delete(id);
            return Ok(JsonConvert.SerializeObject(res));
        }
        // GET: api/Subscriptions/GetAllSubscriptions
        [HttpGet]
        public async Task<IActionResult> GetAllSubscriptions()
        {
            var res = await _subsc.GetAllSubscriptions();
            return Ok(JsonConvert.SerializeObject(res));
        }

    }
}
