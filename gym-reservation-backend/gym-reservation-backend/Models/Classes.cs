using System.Text.Json.Serialization;

namespace gym_reservation_backend.Models
{
    public class Classes
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
 
        public string ClassDay { get; set; }
        public int TrainerId { get; set; }

        // Navigation property
        [JsonIgnore]
        public Trainer? Trainer { get; set; }

        public string ClassTime { get; set; }
        public ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
        public bool IsCancelled { get; set; }
        public int ClassLimit { get; set; }

    }
}
