using gym_reservation_backend.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace gym_reservation_backend.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {

        private readonly IDashboardService _dashService;

        public DashboardController(IDashboardService dashService)
        {
            _dashService = dashService;
        }

        // GET: api/Classes/Get Dashboard Data
        [HttpGet]
        public async Task<IActionResult> GetDashboardDataAsync()
        {
            var res = await _dashService.GetDashboardDataAsync();
            return Ok(JsonConvert.SerializeObject(res));
        }

    }
}
