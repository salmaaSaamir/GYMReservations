namespace gym_reservation_backend.Models
{
    public class DashboardDataDto
    {
        public SubscriptionCountsDto SubscriptionCounts { get; set; }
        public ReservationStatsDto ReservationStats { get; set; }
        public CancellationStatsDto CancellationStats { get; set; }
        public int TotalReservations { get; set; }
        public RadarMetricsDto RadarMetrics { get; set; }
    }

    public class SubscriptionCountsDto
    {
        public string[] Labels { get; set; }
        public int[] Data { get; set; }
    }

    public class ReservationStatsDto
    {
        public string[] Labels { get; set; }
        public int[] Data { get; set; }
    }

    public class CancellationStatsDto
    {
        public int CancelledCount { get; set; }
        public int ActiveCount { get; set; }
    }

    public class RadarMetricsDto
    {
        public int ActiveSubscriptions { get; set; }
        public int TotalReservations { get; set; }
        public int ActiveClasses { get; set; }
        public int ActiveMembers { get; set; }
    }

    // Helper classes for data mapping
    public class SubscriptionCount
    {
        public string Label { get; set; }
        public int Count { get; set; }
    }

    public class MonthlyStat
    {
        public string Label { get; set; }
        public int Count { get; set; }
    }

}
