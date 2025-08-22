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
        public string? Status { get; set; }
        public int CurrentSubscriptionId { get; set; }

        // Navigation property
        [NotMapped]
        [JsonIgnore]
        public Subscription? Subscription { get; set; }
        [NotMapped]

        [JsonIgnore] // Add this to prevent circular reference

        public ICollection<MemberSubscription>? MemberSubscriptions { get; set; }

        [NotMapped]

        [JsonIgnore] // Add this to prevent circular reference

        public ICollection<Reservation>? Reservations { get; set; }
    }
    public class FreezeRequest
    {
        public int MemberId { get; set; }
        public int SubscriptionHistoryId { get; set; }
    }
}
