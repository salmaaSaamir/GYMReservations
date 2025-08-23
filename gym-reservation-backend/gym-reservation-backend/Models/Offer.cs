using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace gym_reservation_backend.Models
{
    public class Offer
    {
        public int Id { get; set; }
        public int Value { get; set; } 
        public int? SubscriptionId { get; set; }
        public bool IsGeneralOffer { get; set; }
        public bool IsActive { get; set; }

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        // Navigation property
        [ForeignKey("SubscriptionId")]
        [JsonIgnore]
        public Subscription? Subscription { get; set; }
    }
}
