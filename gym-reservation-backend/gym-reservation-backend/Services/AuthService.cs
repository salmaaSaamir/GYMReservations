using Azure;
using gym_reservation_backend.Context;
using gym_reservation_backend.Interfaces;
using gym_reservation_backend.Models;
using gym_reservation_backend.Response;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace gym_reservation_backend.Services
{
    public class AuthService: IAuthService
    {

        private readonly DBContext _dbContext;
        private readonly IConfiguration _configuration;
        ServiceResponse _response = new ServiceResponse();


        public AuthService(DBContext context, IConfiguration configuration)
        {
            _dbContext = context;
            _configuration = configuration;
        }
        public async Task<ServiceResponse> Login(LoginModel model)
        {
                var admin = await _dbContext.Users.FirstOrDefaultAsync(x => x.Email == model.Email && x.Password == model.Password);

                if (admin != null)
                {
                    var token = GenerateTokenData(admin, model);
                    _response.Data.Add(token);
                    _response.State = true;
                    _response.token = token;

                    _response.SuccessMessage = "Logged In Successfully";
                }
                else
                {
                    _response.State = false;
                    _response.ErrorMessage = "Logged In Failed";

                }

                return _response;
            
         

        }
        private string GenerateTokenData(User admin, LoginModel model)
        {
            var tokenData = new User();

            tokenData.Id = admin.Id;
            tokenData.FName = admin.FName;
            tokenData.LName = admin.LName;
            tokenData.Email = admin.Email;
            tokenData.RemeberMe = model.IsRememberMe;

            var token = GenerateJwtToken(tokenData);

            return token;
        }
        private string GenerateJwtToken(User tokenData)
        {
            var claims = new List<Claim>
            {
                new Claim("Id", tokenData.Id.ToString()),
                new Claim("Name", tokenData.FName +  tokenData.LName),
                new Claim("Email",  tokenData.Email),
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["JWT:ValidIssuer"],
                audience: _configuration["JWT:ValidAudience"],
                claims: claims,
                expires: tokenData.RemeberMe ? DateTime.Now.AddDays(3) : DateTime.Now.AddHours(5), 
                                                                                                     
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
