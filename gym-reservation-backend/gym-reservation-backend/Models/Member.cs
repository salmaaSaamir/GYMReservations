using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace gym_reservation_backend.Models
{
    public class Member
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; }
        public string IDCard { get; set; }
        public int CurrentSubscriptionId { get; set; }

        // Navigation property
        [NotMapped]
        [JsonIgnore]
        public Subscription Subscription { get; set; }
        public ICollection<MemberSubscription> MemberSubscriptions { get; set; }

        public ICollection<Reservation> Reservations { get; set; }


    }
}
