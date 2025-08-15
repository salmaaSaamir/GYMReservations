using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace gym_reservation_backend.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Password { get; set; } = string.Empty;
        public string FName { get; set; } = string.Empty;
        public string LName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;

        [JsonIgnore]
        public ICollection<UserMenus> UserMenus { get; set; } = new List<UserMenus>();
        [NotMapped]
        public bool RemeberMe { get; set; }

    }


    public class UserMenus
    {
        public int Id { get; set; }
        public int UserId { get; set; }

        [JsonIgnore]
        public User User { get; set; }
        [JsonIgnore]

        public int MenuId { get; set; }
        public SystemMenu Menu { get; set; }

        [NotMapped]
        public bool IsDeleted { get; set; }

    }

    public class UserMenuRequest
    {
        public int UserId { get; set; }
        public List<int> MenuIds { get; set; } = new List<int>();
    }
    public class LoginModel
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public bool IsRememberMe { get; set; }
    }

}
