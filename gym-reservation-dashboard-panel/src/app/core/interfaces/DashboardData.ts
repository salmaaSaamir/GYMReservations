export interface DashboardData {
  subscriptionCounts: SubscriptionCounts;
  reservationStats: ReservationStats;
  cancellationStats: CancellationStats;
  totalReservations: number;
  radarMetrics: RadarMetrics;
}

export interface SubscriptionCounts {
  labels: string[];
  data: number[];
}

export interface ReservationStats {
  labels: string[];
  data: number[];
}

export interface CancellationStats {
  cancelledCount: number;
  activeCount: number;
}

export interface RadarMetrics {
  activeSubscriptions: number;
  totalReservations: number;
  activeClasses: number;
  activeMembers: number;
}