using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace gym_reservation_backend.Models
{
    public class MemberSubscription
    {

        public int Id { get; set; }

        public int MemberId { get; set; }
        [NotMapped]
        [JsonIgnore]
        public Member Member { get; set; }

        public int SubscriptionId { get; set; }
        [NotMapped]
        [JsonIgnore]

        public Subscription Subscription { get; set; }

        // بيانات الاشتراك
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Status { get; set; }  

    }
}
