
using System.Text.Json.Serialization;

namespace gym_reservation_backend.Models
{
    public class Notification
    {
        public int Id { get; set; }
        public string Date { get; set; } = string.Empty;
        public string userEmail { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public bool IsRead { get; set; }


    }
    public class NotificationDto
    {
        [JsonPropertyName("Id")]

        public int Id { get; set; }
        [JsonPropertyName("Title")]

        public string Title { get; set; } = string.Empty;
        [JsonPropertyName("Message")]

        public string Message { get; set; } = string.Empty;
        [JsonPropertyName("Type")]

        public string Type { get; set; } = string.Empty;
        [JsonPropertyName("Date")]

        public string Date { get; set; }
        [JsonPropertyName("IsRead")]

        public bool IsRead { get; set; }
    }

}
