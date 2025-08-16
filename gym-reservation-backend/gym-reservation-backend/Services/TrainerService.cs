using gym_reservation_backend.Context;
using gym_reservation_backend.Interfaces;
using gym_reservation_backend.Models;
using gym_reservation_backend.Response;
using Microsoft.EntityFrameworkCore;

namespace gym_reservation_backend.Services
{
    public class TrainerService: ITrainerService
    {
        private readonly DBContext _dbContext;
        ServiceResponse _response = new ServiceResponse();

        public TrainerService(DBContext dbContext)
        {
            _dbContext = dbContext;
        }


        public async Task<ServiceResponse> GetTrainers(int page = 1, int pageSize = 20)
        {
            try
            {
                var query = _dbContext.Trainers.AsNoTracking(); // Faster read

                var total = await query.CountAsync();

                var trainers = await query
                    .OrderBy(u => u.Id)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                // Get last row IdCard
                var lastTrainerIdCard = await _dbContext.Trainers
                    .OrderByDescending(t => t.Id)
                    .Select(t => t.IDCard)
                    .FirstOrDefaultAsync();

                _response.State = true;
                _response.Data.Add(total);
                _response.Data.Add(page);
                _response.Data.Add(pageSize);
                _response.Data.Add(trainers);
                _response.Data.Add(lastTrainerIdCard??""); // Add last IdCard
            }
            catch (Exception ex)
            {
                _response.State = false;
                _response.ErrorMessage = $"Error retrieving trainers: {ex.Message}";
            }

            return _response;
        }
        public async Task<ServiceResponse> GetAllTrainers()
        {
            try
            {
                var trainers =await  _dbContext.Trainers.AsNoTracking().Where(x=>!x.IsGeneralTrainer).ToListAsync(); // Faster read
                _response.State = true;
             
                _response.Data.Add(trainers);
                
            }
            catch (Exception ex)
            {
                _response.State = false;
                _response.ErrorMessage = $"Error retrieving trainers: {ex.Message}";
            }

            return _response;
        }
        public async Task<bool> Delete(int TrainerId)
        {
            if (IsExists(TrainerId))
            {
                var Trainer = await _dbContext.Trainers.FirstAsync(x => x.Id == TrainerId);

                _dbContext.Trainers.Remove(Trainer);
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
            return _dbContext.Trainers.Any(e => e.Id == id);
        }


        public async Task<ServiceResponse> Save(Trainer Trainer)
        {
            if (Trainer.Id == 0) // save
            {
                _dbContext.Trainers.Add(Trainer);
                await _dbContext.SaveChangesAsync();
            }
            else // update
            {
                _dbContext.Trainers.Update(Trainer);
                await _dbContext.SaveChangesAsync();
            }

            await _dbContext.SaveChangesAsync();
            _response.State = true;
            _response.Data.Add(Trainer);
            return _response;
        }
    }
}
