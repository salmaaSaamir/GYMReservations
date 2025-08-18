using gym_reservation_backend.Context;
using gym_reservation_backend.Interfaces;
using Microsoft.EntityFrameworkCore;
using gym_reservation_backend.Models;
using gym_reservation_backend.Response;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace gym_reservation_backend.Services
{
    public class UserService: IUserService
    {
        private readonly DBContext _dbContext;
        ServiceResponse _response = new ServiceResponse();

        public UserService(DBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<ServiceResponse> GetUserMenus(int userId)
        {

            try
            {
                // Get all menus assigned to this user
                var userMenus = await _dbContext.UserMenus
                    .Include(um => um.Menu) // Include the Menu navigation property
                    .Where(um => um.UserId == userId)
                    .Select(um => new
                    {
                        um.Menu.Id,
                        um.Menu.DisplayName,
                        um.Menu.IconName,
                        um.Menu.Route,
                        um.Menu.ArrangeNumber
                    }).OrderBy(um => um.ArrangeNumber)
                    .ToListAsync();

                if (userMenus == null || !userMenus.Any())
                {
                    _response.State = false;
                    _response.ErrorMessage = "No menus found for this user";
                    return _response;
                }

                _response.State = true;
                _response.Data.Add(userMenus);
                return _response;
            }
            catch (Exception ex)
            {
                _response.State = false;
                _response.ErrorMessage = $"Error retrieving user menus: {ex.Message}";
                return _response;
            }
        }

        public async Task<ServiceResponse> GetSystemMenus()
        {

            try
            {

                var userMenus = await _dbContext.SystemMenus
                    .ToListAsync();
                _response.State = true;
                _response.Data.Add(userMenus);
                return _response;
            }
            catch (Exception ex)
            {
                _response.State = false;
                _response.ErrorMessage = $"Error retrieving user menus: {ex.Message}";
                return _response;
            }
        }


        public async Task<ServiceResponse> GetUsers(int page = 1, int pageSize = 20)
        {
            
            try
            {
                var query = _dbContext.Users.AsNoTracking(); // Faster read, no change tracking

                var total = await query.CountAsync();
                var users = await query
                    .OrderBy(u => u.Id)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                _response.State = true;
                _response.Data.Add(total);
                _response.Data.Add(page);
                _response.Data.Add(pageSize);
                _response.Data.Add(users);
              
            }
            catch (Exception ex)
            {
                _response.State = false;
                _response.ErrorMessage = $"Error retrieving users: {ex.Message}";
            }
            return _response;
        }

        public async Task<ServiceResponse> UpsertUser(User user)
        {
            
            try
            {
                if (user.Id == 0)
                {
                    // Add new
                    _dbContext.Users.Add(user);
                }
                else
                {
                    // Update only if exists
                    _dbContext.Users.Update(user);

                }

                await _dbContext.SaveChangesAsync();

                _response.State = true;
                _response.Data.Add(user);
            }
            catch (Exception ex)
            {
                _response.State = false;
                _response.ErrorMessage = $"Error saving user: {ex.Message}";
            }
            return _response;
        }




        public async Task<ServiceResponse> DeleteUser(int id)
        {
            
            try
            {

                if (IsExists(id))
                {
                    var Trainer = await _dbContext.Trainers.FirstAsync(x => x.Id == id);

                    _dbContext.Trainers.Remove(Trainer);
                    await _dbContext.SaveChangesAsync();


                 

                    _response.State = true;
                }
                else
                {
                    _response.State = false;
                    _response.ErrorMessage = "User not found";
                    return _response;
                }


            }
            catch (Exception ex)
            {
                _response.State = false;
                _response.ErrorMessage = $"Error deleting user: {ex.Message}";
            }
            return _response;
        }
        private bool IsExists(int id)
        {
            return _dbContext.Users.Any(e => e.Id == id);
        }
        public async Task<ServiceResponse> SaveUserMenus(UserMenuRequest request)
        {
            try
            {
                // Get existing menus for the user
                var existingMenus = await _dbContext.UserMenus
                    .Where(x => x.UserId == request.UserId)
                    .ToListAsync();

                // Determine menus to add and remove
                var menusToAdd = request.MenuIds.Except(existingMenus.Select(x => x.MenuId));
                var menusToRemove = existingMenus.Where(x => !request.MenuIds.Contains(x.MenuId));

                // Add new menus
                foreach (var menuId in menusToAdd)
                {
                    _dbContext.UserMenus.Add(new UserMenus
                    {
                        UserId = request.UserId,
                        MenuId = menuId
                    });
                }

                // Remove deleted menus
                _dbContext.UserMenus.RemoveRange(menusToRemove);

                await _dbContext.SaveChangesAsync();
                _response.State = true;
                _response.SuccessMessage = "User menus saved successfully";

                return _response;

            }
            catch (Exception ex)
            {
                return _response;
            }
        }

    }
}
