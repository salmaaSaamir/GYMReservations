using gym_reservation_backend.Context;
using gym_reservation_backend.Interfaces;
using gym_reservation_backend.Models;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Data;

namespace gym_reservation_backend.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly IConfiguration _configuration;

        public DashboardService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<DashboardDataDto> GetDashboardDataAsync()
        {
            var dashboardData = new DashboardDataDto();
            var connectionString = _configuration.GetConnectionString("Connection");

            using (var connection = new SqlConnection(connectionString))
            {
                await connection.OpenAsync();

                using (var command = new SqlCommand("sp_GetDashboardData", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        // Result Set 1: Subscription Counts
                        var subscriptionCounts = new List<SubscriptionCount>();
                        while (await reader.ReadAsync())
                        {
                            subscriptionCounts.Add(new SubscriptionCount
                            {
                                Label = reader["Label"].ToString(),
                                Count = Convert.ToInt32(reader["Count"])
                            });
                        }

                        dashboardData.SubscriptionCounts = new SubscriptionCountsDto
                        {
                            Labels = subscriptionCounts.Select(x => x.Label).ToArray(),
                            Data = subscriptionCounts.Select(x => x.Count).ToArray()
                        };

                        // Result Set 2: Monthly Reservation Stats
                        await reader.NextResultAsync();
                        var monthlyStats = new List<MonthlyStat>();
                        while (await reader.ReadAsync())
                        {
                            monthlyStats.Add(new MonthlyStat
                            {
                                Label = reader["Label"].ToString(),
                                Count = Convert.ToInt32(reader["Count"])
                            });
                        }

                        dashboardData.ReservationStats = new ReservationStatsDto
                        {
                            Labels = monthlyStats.Select(x => x.Label).ToArray(),
                            Data = monthlyStats.Select(x => x.Count).ToArray()
                        };

                        // Result Set 3: Class Cancellation Stats
                        await reader.NextResultAsync();
                        if (await reader.ReadAsync())
                        {
                            dashboardData.CancellationStats = new CancellationStatsDto
                            {
                                CancelledCount = Convert.ToInt32(reader["CancelledCount"]),
                                ActiveCount = Convert.ToInt32(reader["ActiveCount"])
                            };
                        }

                        // Result Set 4: Total Reservations
                        await reader.NextResultAsync();
                        if (await reader.ReadAsync())
                        {
                            dashboardData.TotalReservations = Convert.ToInt32(reader["TotalReservations"]);
                        }

                        // Result Set 5: Additional metrics for radar chart
                        await reader.NextResultAsync();
                        if (await reader.ReadAsync())
                        {
                            dashboardData.RadarMetrics = new RadarMetricsDto
                            {
                                ActiveSubscriptions = Convert.ToInt32(reader["ActiveSubscriptions"]),
                                TotalReservations = Convert.ToInt32(reader["TotalReservations"]),
                                ActiveClasses = Convert.ToInt32(reader["ActiveClasses"]),
                                ActiveMembers = Convert.ToInt32(reader["ActiveMembers"])
                            };
                        }
                    }
                }
            }

            return dashboardData;
        }
    }

   
}