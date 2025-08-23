using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace gym_reservation_backend.Models
{
    public class MemberSubscription
    {
        public int Id { get; set; }

        public int MemberId { get; set; }

        [ForeignKey("MemberId")]
        [JsonIgnore]
        [NotMapped]// Add this to break the circular reference
        public Member? Member { get; set; }

        public int SubscriptionId { get; set; }

        [ForeignKey("SubscriptionId")]
        [JsonIgnore]
        public Subscription? Subscription { get; set; }

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Status { get; set; }

        public int? RemainingFreezeDays { get; set; }
        public DateTime? FreezeStartDate { get; set; }
        public DateTime? FreezeEndDate { get; set; }


        public int? OfferId { get; set; }

        [ForeignKey("OfferId")]
        [JsonIgnore]
        public Offer? Offer { get; set; }
    }
}