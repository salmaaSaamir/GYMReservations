using gym_reservation_backend.Interfaces;
using gym_reservation_backend.Models;
using gym_reservation_backend.Response;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace gym_reservation_backend.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _user;

        public UsersController(IUserService user)
        {
            _user = user;
        }

        // GET: api/Users/GetUserMenus/5
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetUserMenus(int userId)
        {
            var res = await _user.GetUserMenus(userId);
            return Ok(JsonConvert.SerializeObject(res));
        }
        // GET: api/Users/GetSystemMenus/5
        [HttpGet]
        public async Task<IActionResult> GetSystemMenus()
        {
            var res = await _user.GetSystemMenus();
            return Ok(JsonConvert.SerializeObject(res));
        }
        // GET: api/Users/GetUsers?page=1&pageSize=20
        [HttpGet]
        public async Task<IActionResult> GetUsers([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var res = await _user.GetUsers(page, pageSize);
            return Ok(JsonConvert.SerializeObject(res));
        }

        // POST: api/Users/SaveUser
        // Will Add if Id == 0, Update otherwise
        [HttpPost]
        public async Task<IActionResult> SaveUser([FromBody] User user)
        {
            var res = await _user.UpsertUser(user);
            return Ok(JsonConvert.SerializeObject(res));
        }

        // DELETE: api/Users/DeleteUser/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var res = await _user.DeleteUser(id);
            return Ok(JsonConvert.SerializeObject(res));
        }


        [HttpPost]
        public async Task<IActionResult> SaveUserMenus([FromBody] UserMenuRequest request)
        {

            var res = await _user.SaveUserMenus(request);
            return Ok(JsonConvert.SerializeObject(res));
        
        }

    }
}
