using gym_reservation_backend.Interfaces;


namespace gym_reservation_backend.Services
{
    public class SubscriptionBackgroundService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;

        public SubscriptionBackgroundService(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            using var scope = _serviceProvider.CreateScope();
            var memberService = scope.ServiceProvider.GetRequiredService<IMemberService>();

            // Initialize subscription expiration checks
            if (memberService is MemberService concreteService)
            {
                concreteService.InitializeSubscriptionExpirationChecks();
            }

            await Task.CompletedTask;
        }
    }
}