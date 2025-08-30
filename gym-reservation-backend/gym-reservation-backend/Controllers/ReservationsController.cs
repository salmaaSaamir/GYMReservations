using gym_reservation_backend.Interfaces;
using gym_reservation_backend.Models;
using gym_reservation_backend.Response;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace gym_reservation_backend.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ReservationsController : ControllerBase
    {
        private readonly IReservationService _reservationService;

        public ReservationsController(IReservationService reservationService)
        {
            _reservationService = reservationService;
        }

        // GET: api/Reservations/GetReservations?page=1&pageSize=20
        [HttpGet]
        public async Task<IActionResult> GetReservations([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var res = await _reservationService.GetReservations(page, pageSize);
            return Ok(JsonConvert.SerializeObject(res));
        }

        // GET: api/Reservations/CheckClassLimitConflict?classDay=2024-01-15&classTime=10:00
        [HttpGet("{classId}")]
        public async Task<IActionResult> CheckClassAvailability(int classId)
        {

            var res = await _reservationService.CheckClassAvailability(classId);
            return Ok(JsonConvert.SerializeObject(res));
        }
        [HttpGet("{classId}/{memberId}/{classDay}")]
        public async Task<IActionResult> CheckMemberReservation(int classId, int memberId, string classDay)
        {
            var res = await _reservationService.CheckMemberReservation(classId, memberId, classDay);
            return Ok(JsonConvert.SerializeObject(res));
        }
        // POST: api/Reservations/SaveReservation
        // Will Add if Id == 0, Update otherwise

        [HttpPost("{email}")]
        public async Task<IActionResult> SaveReservation([FromBody] Reservation reservation,string email)
        {
            var res = await _reservationService.SaveReservation(reservation, email);
            return Ok(JsonConvert.SerializeObject(res));
        }

        // DELETE: api/Reservations/DeleteReservation/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReservation(int id)
        {
            var res = await _reservationService.Delete(id);
            return Ok(JsonConvert.SerializeObject(res));
        }
    }
}