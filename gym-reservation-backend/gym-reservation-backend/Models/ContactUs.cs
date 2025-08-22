using System.ComponentModel.DataAnnotations.Schema;

namespace gym_reservation_backend.Models
{
    public class ContactUs
    {
        public int Id { get; set; }

        public string Message { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Response { get; set; }

    }

    public class EmailResponseRequest
    {
        public string ResponseMessage { get; set; } = string.Empty;
    }

}
