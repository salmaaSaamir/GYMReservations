using Azure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using gym_reservation_backend.Context;
using gym_reservation_backend.Models;
using gym_reservation_backend.Response;

namespace gym_reservation_backend.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class NotificationsController : ControllerBase
    {
        private readonly DBContext _context;
        private readonly ServiceResponse _response = new ServiceResponse();

        public NotificationsController(DBContext context)
        {
            _context = context;
        }

       
    }
}