using gym_reservation_backend.Interfaces;
using gym_reservation_backend.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace gym_reservation_backend.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class OffersController : ControllerBase
    {
        private readonly IOfferService _offerService;

        public OffersController(IOfferService offerService)
        {
            _offerService = offerService;
        }

        // GET: api/Offers/GetOffers?page=1&pageSize=20
        [HttpGet]
        public async Task<IActionResult> GetOffers([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var res = await _offerService.GetOffers(page, pageSize);
            return Ok(JsonConvert.SerializeObject(res));
        }

        // POST: api/Offers/SaveOffer
        // Will Add if Id == 0, Update otherwise
        [HttpPost]
        public async Task<IActionResult> SaveOffer([FromBody] Offer offer)
        {
            var res = await _offerService.Save(offer);
            return Ok(JsonConvert.SerializeObject(res));
        }

        // DELETE: api/Offers/DeleteOffer/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOffer(int id)
        {
            var res = await _offerService.Delete(id);
            return Ok(JsonConvert.SerializeObject(res));
        }
    }
}