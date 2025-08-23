using gym_reservation_backend.Context;
using gym_reservation_backend.Interfaces;
using gym_reservation_backend.Models;
using gym_reservation_backend.Response;
using Hangfire;
using Microsoft.EntityFrameworkCore;

namespace gym_reservation_backend.Services
{
    public class OfferService : IOfferService
    {
        private readonly DBContext _dbContext;
        private readonly IBackgroundJobClient _backgroundJobClient;
        ServiceResponse _response = new ServiceResponse();

        public OfferService(DBContext dbContext, IBackgroundJobClient backgroundJobClient)
        {
            _dbContext = dbContext;
            _backgroundJobClient = backgroundJobClient;
        }

        public async Task<ServiceResponse> GetOffers(int page = 1, int pageSize = 20)
        {
            try
            {
                var query = _dbContext.Offers.Include(x => x.Subscription).AsNoTracking();

                var total = await query.CountAsync();

                var Offers = await query
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                _response.State = true;
                _response.Data.Add(total);
                _response.Data.Add(page);
                _response.Data.Add(pageSize);
                _response.Data.Add(Offers);
            }
            catch (Exception ex)
            {
                _response.State = false;
                _response.ErrorMessage = $"Error retrieving Offers: {ex.Message}";
            }

            return _response;
        }

        public async Task<bool> Delete(int offerId)
        {
            if (IsExists(offerId))
            {
                var Offer = await _dbContext.Offers.FirstAsync(x => x.Id == offerId);
                _dbContext.Offers.Remove(Offer);
                await _dbContext.SaveChangesAsync();
                return true;
            }
            else
            {
                return false;
            }
        }

        private bool IsExists(int id)
        {
            return _dbContext.Offers.Any(e => e.Id == id);
        }

        public async Task<ServiceResponse> Save(Offer offer)
        {
            try
            {
                if (offer.Id == 0) // save
                {
                    _dbContext.Offers.Add(offer);
                    await _dbContext.SaveChangesAsync();

                    // Schedule activation and deactivation jobs for new offers
                    ScheduleOfferStatusJobs(offer);
                }
                else // update
                {
                    _dbContext.Offers.Update(offer);
                    await _dbContext.SaveChangesAsync();

                    // Reschedule jobs for updated offer
                    ScheduleOfferStatusJobs(offer);
                }

                _response.State = true;
                _response.Data.Add(offer);
            }
            catch (Exception ex)
            {
                _response.State = false;
                _response.ErrorMessage = $"Error saving Offer: {ex.Message}";
            }

            return _response;
        }

        private void ScheduleOfferStatusJobs(Offer offer)
        {
            // Remove any existing jobs for this offer
            // Note: In a real implementation, you might want to store job IDs
            // and manage them more carefully

            // Schedule activation if start date is in the future
            if (offer.StartDate > DateTime.Now)
            {
                _backgroundJobClient.Schedule(
                    () => ActivateOffer(offer.Id),
                    offer.StartDate
                );
            }
            else if (!offer.IsActive && offer.StartDate <= DateTime.Now && offer.EndDate >= DateTime.Now)
            {
                // Activate immediately if start date has passed but offer is not active
                _backgroundJobClient.Enqueue(() => ActivateOffer(offer.Id));
            }

            // Schedule deactivation
            if (offer.EndDate > DateTime.Now)
            {
                _backgroundJobClient.Schedule(
                    () => DeactivateOffer(offer.Id),
                    offer.EndDate
                );
            }
            else if (offer.IsActive && offer.EndDate <= DateTime.Now)
            {
                // Deactivate immediately if end date has passed but offer is still active
                _backgroundJobClient.Enqueue(() => DeactivateOffer(offer.Id));
            }
        }

        [AutomaticRetry(Attempts = 3)]
        public async Task ActivateOffer(int offerId)
        {
            try
            {
                var offer = await _dbContext.Offers.FindAsync(offerId);
                if (offer != null && !offer.IsActive && DateTime.Now >= offer.StartDate && DateTime.Now <= offer.EndDate)
                {
                    offer.IsActive = true;
                    _dbContext.Offers.Update(offer);
                    await _dbContext.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                // Log error here
                throw;
            }
        }

        [AutomaticRetry(Attempts = 3)]
        public async Task DeactivateOffer(int offerId)
        {
            try
            {
                var offer = await _dbContext.Offers.FindAsync(offerId);
                if (offer != null && offer.IsActive)
                {
                    offer.IsActive = false;
                    _dbContext.Offers.Update(offer);
                    await _dbContext.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                // Log error here
                throw;
            }
        }

        // Method to initialize offer statuses on application startup
        [AutomaticRetry(Attempts = 3)]
        public async Task InitializeOfferStatuses()
        {
            try
            {
                var offers = await _dbContext.Offers.ToListAsync();

                foreach (var offer in offers)
                {
                    bool shouldBeActive = DateTime.Now >= offer.StartDate && DateTime.Now <= offer.EndDate;

                    if (offer.IsActive != shouldBeActive)
                    {
                        offer.IsActive = shouldBeActive;
                        _dbContext.Offers.Update(offer);
                    }

                    // Schedule future status changes
                    ScheduleOfferStatusJobs(offer);
                }

                await _dbContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                // Log error here
                throw;
            }
        }
    }
}