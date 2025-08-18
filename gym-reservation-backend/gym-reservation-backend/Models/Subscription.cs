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

        [NotMapped]
        public ICollection<MemberSubscription>? MemberSubscriptions { get; set; }
    }
}
