using System.Text.Json.Serialization;

namespace gym_reservation_backend.Models
{
    public class Trainer
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; }
        public string IDCard { get; set; }
        public bool IsGeneralTrainer { get; set; }

    }
}
