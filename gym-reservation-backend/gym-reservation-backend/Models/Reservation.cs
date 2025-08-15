using System.Text.Json.Serialization;

namespace gym_reservation_backend.Models
{
    public class Reservation
    {
        public int Id { get; set; }
        public string ReservationNo { get; set; } = string.Empty;
     

        public int ClassId { get; set; }

        // Navigation property
        [JsonIgnore]
        public Classes Class { get; set; }
        public int MemberId { get; set; }

        // Navigation property
        [JsonIgnore]
        public Member Member { get; set; }
        public int TrainerId { get; set; }

        // Navigation property
        [JsonIgnore]
        public Trainer Trainer { get; set; }

    }
}
