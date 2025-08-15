using System.Text.Json.Serialization;

namespace gym_reservation_backend.Models
{
    public class SystemMenu
    {
        public int Id { get; set; }
        public string DisplayName { get; set; }
        public string IconName { get; set; }
        public string Route { get; set; }
        [JsonIgnore]
        public ICollection<UserMenus> UserMenus { get; set; } = new List<UserMenus>();


    }
}
