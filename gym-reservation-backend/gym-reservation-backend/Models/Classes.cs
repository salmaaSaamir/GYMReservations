namespace gym_reservation_backend.Models
{
    public class Classes
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
 
        public string ClassDate { get; set; }
        public string ClassTime { get; set; }
        public ICollection<Reservation> Reservations { get; set; }

    }
}
