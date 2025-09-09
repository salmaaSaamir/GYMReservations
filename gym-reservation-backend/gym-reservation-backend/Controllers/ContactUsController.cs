using gym_reservation_backend.Interfaces;
using gym_reservation_backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace gym_reservation_backend.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    
    public class ContactUsController : ControllerBase
    {
        private readonly IContactService _contactService;

        public ContactUsController(IContactService contactService)
        {
            _contactService = contactService;
        }

        // GET: api/ContactUs/GetContacts?page=1&pageSize=20
        [HttpGet]
        public async Task<IActionResult> GetContacts([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var res = await _contactService.GetContacts(page, pageSize);
            return Ok(JsonConvert.SerializeObject(res));
        }
        // POST: api/ContactUs/SaveContact
        // Will Add if Id == 0, Update otherwise
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> SaveContact([FromBody] ContactUs contact)
        {
            var res = await _contactService.Save(contact);
            return Ok(JsonConvert.SerializeObject(res));
        }

        // POST: api/ContactUs/ResponseByEmail/5
        [HttpPost]
        public async Task<IActionResult> ResponseByEmail( [FromBody] ContactUs request)
        {
            var res = await _contactService.ResponseByEmail( request);
            return Ok(JsonConvert.SerializeObject(res));
        }

        // DELETE: api/ContactUs/DeleteContact/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteContact(int id)
        {
            var res = await _contactService.Delete(id);
            return Ok(JsonConvert.SerializeObject(res));
        }
    }

}