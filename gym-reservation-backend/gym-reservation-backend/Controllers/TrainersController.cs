using gym_reservation_backend.Interfaces;
using gym_reservation_backend.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace gym_reservation_backend.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class TrainersController : ControllerBase
    {
        private readonly ITrainerService _trainer;

        public TrainersController(ITrainerService trainer)
        {
            _trainer = trainer;
        }
        // GET: api/Trainers/GetTrainers?page=1&pageSize=20
        [HttpGet]
        public async Task<IActionResult> GetTrainers([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var res = await _trainer.GetTrainers(page, pageSize);
            return Ok(JsonConvert.SerializeObject(res));
        }

        // POST: api/Trainers/SaveTrainer
        // Will Add if Id == 0, Update otherwise
        [HttpPost]
        public async Task<IActionResult> SaveTrainer([FromBody] Trainer trainer)
        {
            var res = await _trainer.Save(trainer);
            return Ok(JsonConvert.SerializeObject(res));
        }

        // DELETE: api/Trainers/DeleteTrainer/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTrainer(int id)
        {
            var res = await _trainer.Delete(id);
            return Ok(JsonConvert.SerializeObject(res));
        }
    }
}
