using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace gym_reservation_backend.Models
{
    public class Reservation
    {
        public int Id { get; set; }
        [ForeignKey("Class")]
        public int ClassId { get; set; }
        // Navigation property
        [JsonIgnore]
        [NotMapped]
        public Classes? Class { get; set; }
        [ForeignKey("Member")]
        public int MemberId { get; set; }
        // Navigation property
        [JsonIgnore]
        [NotMapped]
        public Member? Member { get; set; }

    }
}
