using System.Text.Json.Serialization;

namespace gym_reservation_backend.Models
{
    public class Trainer
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; }
        public string IDCard { get; set; }

        public int ClassId { get; set; }

        // Navigation property
        [JsonIgnore]
        public Classes Class { get; set; }

        public ICollection<Reservation> Reservations { get; set; }

    }
}
