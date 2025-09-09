using gym_reservation_backend.Interfaces;
using gym_reservation_backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace gym_reservation_backend.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ClassesController : ControllerBase
    {
        private readonly IClassService _classService;

        public ClassesController(IClassService classService)
        {
            _classService = classService;
        }

        // GET: api/Classes/GetClasses
        [HttpGet]
        public async Task<IActionResult> GetClasses([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var res = await _classService.GetClasses(page, pageSize);
            return Ok(JsonConvert.SerializeObject(res));
        }

        // GET: api/Classes/GetAllClasses
        [HttpGet]
        public async Task<IActionResult> GetAllClasses()
        {
            var res = await _classService.GetAllClasses();
            return Ok(JsonConvert.SerializeObject(res));
        }
        // GET: api/Classes/CheckClassConflict?classDay=monday&classTime=10:00
        [HttpGet]
        public async Task<IActionResult> CheckClassConflict([FromQuery] string classDay, [FromQuery] string classTime)
        {
            var res = await _classService.CheckClassConflict(classDay, classTime);
            return Ok(JsonConvert.SerializeObject(res));
        }

        // GET: api/Classes/GetClassReservations/5
        [HttpGet("{classId}")]
        public async Task<IActionResult> GetClassReservations(int classId)
        {
            var res = await _classService.GetClassReservations(classId);
            return Ok(JsonConvert.SerializeObject(res));
        }

        // POST: api/Classes/SaveClass
        [HttpPost]
        public async Task<IActionResult> SaveClass([FromBody] Classes classToSave)
        {

            var res = await _classService.Save(classToSave);
            return Ok(JsonConvert.SerializeObject(res));
        }

        // DELETE: api/Classes/DeleteClass/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteClass(int id)
        {
            var res = await _classService.Delete(id);
            return Ok(JsonConvert.SerializeObject(res));
        }
        // POST: api/Classes/CancelClass

        [HttpPost("{id}/{email}")]
        public async Task<IActionResult> CancelClass(int id,string email)
        {
            var res = await _classService.CancelClass(id,email);
            return Ok(JsonConvert.SerializeObject(res));
        }
        // GET: api/Classes/GetWeeklySchedule

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetWeeklySchedule([FromQuery] DateTime? date = null)
        {
            var res = await _classService.GetWeeklySchedule(date);
            return Ok(JsonConvert.SerializeObject(res));
        }
    }
}