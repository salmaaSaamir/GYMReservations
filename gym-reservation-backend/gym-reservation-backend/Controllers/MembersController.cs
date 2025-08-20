using gym_reservation_backend.Interfaces;
using gym_reservation_backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace gym_reservation_backend.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class MembersController : ControllerBase
    {
        private readonly IMemberService _memberService;

        public MembersController(IMemberService memberService)
        {
            _memberService = memberService;
        }

        // GET: api/Members/GetMembers?page=1&pageSize=20
        [HttpGet]
        public async Task<IActionResult> GetMembers([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var res = await _memberService.GetMembers(page, pageSize);
            return Ok(JsonConvert.SerializeObject(res));
        }

        // GET: api/Members/GetAllMembers
        [HttpGet]
        public async Task<IActionResult> GetAllMembers()
        {
            var res = await _memberService.GetAllMembers();
            return Ok(JsonConvert.SerializeObject(res));
        }

        // GET: api/Members/GetSubscriptionHistory/5
        [HttpGet("{memberId}")]
        public async Task<IActionResult> GetSubscriptionHistory(int memberId)
        {
            var res = await _memberService.GetMemberSubscriptionHistory(memberId);
            return Ok(JsonConvert.SerializeObject(res));
        }

        // GET: api/Members/GetActiveSubscription/5
        [HttpGet("{memberId}")]
        public async Task<IActionResult> GetActiveSubscription(int memberId)
        {
            var res = await _memberService.GetActiveSubscription(memberId);
            return Ok(JsonConvert.SerializeObject(res));
        }

        // POST: api/Members/FreezeSubscription
        [HttpPost]
        public async Task<IActionResult> FreezeSubscription([FromBody] FreezeRequest request)
        {
            var res = await _memberService.FreezeSubscription(request.MemberId, request.SubscriptionHistoryId);
            return Ok(JsonConvert.SerializeObject(res));
        }

        // POST: api/Members/SaveMember
        [HttpPost]
        public async Task<IActionResult> SaveMember([FromBody] Member member)
        {
            var res = await _memberService.Save(member);
            return Ok(JsonConvert.SerializeObject(res));
        }

        // DELETE: api/Members/DeleteMember/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMember(int id)
        {
            var res = await _memberService.Delete(id);
            return Ok(JsonConvert.SerializeObject(res));
        }
    }

   
}