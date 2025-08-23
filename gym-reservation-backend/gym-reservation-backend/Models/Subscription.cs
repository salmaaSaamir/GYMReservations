using System.ComponentModel.DataAnnotations.Schema;

namespace gym_reservation_backend.Models
{
    public class Subscription
    {

        public int Id { get; set; }

        public string Name { get; set; }         
        public string Description { get; set; }  
        public decimal Price { get; set; }      
        public bool IsActive { get; set; }       
        public int? FreezeDays { get; set; }   
        public int InvetaionsNo { get; set; }
        public int MonthsNo { get; set; }

        [NotMapped]
        public ICollection<MemberSubscription>? MemberSubscriptions { get; set; }
    }

    // Create this class in your models or DTOs folder
    public class SubscriptionHistoryDto
    {
        public int Id { get; set; }
        public int MemberId { get; set; }
        public int SubscriptionId { get; set; }
        public string SubscriptionName { get; set; }
        public string SubscriptionDescription { get; set; }
        public decimal SubscriptionPrice { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Status { get; set; }
        public int? RemainingFreezeDays { get; set; }
        public DateTime? FreezeStartDate { get; set; }
        public DateTime? FreezeEndDate { get; set; }
        public int DurationDays { get; set; }
        public List<OfferDto> Offers { get; set; } = new List<OfferDto>();
    }

    public class OfferDto
    {
        public int Id { get; set; }
        public int Value { get; set; }
        public bool IsGeneralOffer { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}
