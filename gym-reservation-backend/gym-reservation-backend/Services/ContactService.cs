using gym_reservation_backend.Context;
using gym_reservation_backend.Interfaces;
using gym_reservation_backend.Models;
using gym_reservation_backend.Response;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Net.Mail;

namespace gym_reservation_backend.Services
{
    public class ContactService : IContactService
    {
        private readonly DBContext _dbContext;
        private readonly IConfiguration _configuration;
        ServiceResponse _response = new ServiceResponse();

        public ContactService(DBContext dbContext, IConfiguration configuration)
        {
            _dbContext = dbContext;
            _configuration = configuration;
        }

        public async Task<ServiceResponse> GetContacts(int page = 1, int pageSize = 20)
        {
            try
            {
                var query = _dbContext.ContactUs.AsNoTracking(); // Faster read

                var total = await query.CountAsync();

                var contacts = await query
                    .OrderByDescending(u => u.Id) // Order by newest first
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                _response.State = true;
                _response.Data.Add(total);
                _response.Data.Add(page);
                _response.Data.Add(pageSize);
                _response.Data.Add(contacts);
            }
            catch (Exception ex)
            {
                _response.State = false;
                _response.ErrorMessage = $"Error retrieving Contacts: {ex.Message}";
            }

            return _response;
        }

        public async Task<bool> Delete(int contactId)
        {
            if (IsExists(contactId))
            {
                var contact = await _dbContext.ContactUs.FirstAsync(x => x.Id == contactId);
                _dbContext.ContactUs.Remove(contact);
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
            return _dbContext.ContactUs.Any(e => e.Id == id);
        }

        public async Task<ServiceResponse> Save(ContactUs contact)
        {
            try
            {
                if (contact.Id == 0) // save
                {
                    _dbContext.ContactUs.Add(contact);
                }
                else // update
                {
                    _dbContext.ContactUs.Update(contact);
                }

                await _dbContext.SaveChangesAsync();
                _response.State = true;
                _response.Data.Add(contact);
            }
            catch (Exception ex)
            {
                _response.State = false;
                _response.ErrorMessage = $"Error saving contact: {ex.Message}";
            }

            return _response;
        }

        public async Task<ServiceResponse> ResponseByEmail(ContactUs contact)
        {
            try
            {

                if (contact == null)
                {
                    _response.State = false;
                    _response.ErrorMessage = "Contact not found";
                    return _response;
                }

                // Send email
                var emailSent = await SendResponseEmail(contact.Email, contact.Response, contact.Message);

                if (emailSent)
                {
                    // Update the contact with the response
                    contact.Response = contact.Response;
                    _dbContext.ContactUs.Update(contact);
                    await _dbContext.SaveChangesAsync();

                    _response.State = true;
                    _response.Data.Add("Email sent successfully");
                }
                else
                {
                    _response.State = false;
                    _response.ErrorMessage = "Failed to send email";
                }
            }
            catch (Exception ex)
            {
                _response.State = false;
                _response.ErrorMessage = $"Error sending response email: {ex.Message}";
            }

            return _response;
        }

        private async Task<bool> SendResponseEmail(string toEmail, string responseMessage, string originalMessage)
        {
            try
            {
                var smtpSettings = _configuration.GetSection("SmtpSettings");
                var fromEmail = smtpSettings["Email"] ?? "gymgymreservations@gmail.com";
                var password = smtpSettings["Password"];
                var host = smtpSettings["Host"] ?? "smtp.gmail.com";
                var port = int.Parse(smtpSettings["Port"] ?? "587");
                var enableSsl = bool.Parse(smtpSettings["EnableSsl"] ?? "true");


             
                using (var message = new MailMessage())
                {
                    message.From = new MailAddress(fromEmail);
                    message.To.Add(toEmail);
                    message.Subject = "Response to your gym reservation inquiry";
                    message.IsBodyHtml = true;

                    message.Body = $@"
                    <html>
                    <body style='font-family: Arial, sans-serif; line-height: 1.6;'>
                        <div style='max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;'>
                            <h2 style='color: #333;'>Gym Reservation System Response</h2>
                            <p>Dear Valued Member,</p>
                            
                            <p>Thank you for contacting us. Here is our response to your inquiry:</p>
                            
                            <div style='background-color: #f9f9f9; padding: 15px; border-left: 4px solid #007bff; margin: 20px 0;'>
                                <p><strong>Your original message:</strong></p>
                                <p>{WebUtility.HtmlEncode(originalMessage)}</p>
                            </div>
                            
                            <div style='background-color: #e8f5e8; padding: 15px; border-left: 4px solid #28a745; margin: 20px 0;'>
                                <p><strong>Our response:</strong></p>
                                <p>{WebUtility.HtmlEncode(responseMessage)}</p>
                            </div>
                            
                            <p>If you have any further questions, please don't hesitate to contact us.</p>
                            
                            <hr style='border: none; border-top: 1px solid #ddd; margin: 20px 0;'>
                            
                            <p style='color: #666; font-size: 14px;'>
                                Best regards,<br>
                                <strong>Gym Reservation Team</strong><br>
                                gymgymreservations@gmail.com
                            </p>
                        </div>
                    </body>
                    </html>";

                    using (var smtpClient = new SmtpClient(host, port))
                    {
                        smtpClient.Credentials = new NetworkCredential(fromEmail, password);
                        smtpClient.EnableSsl = enableSsl;

                        await smtpClient.SendMailAsync(message);
                    }
                }

                return true;
            }
            catch (Exception ex)
            {
                // Log the error (you might want to use a proper logging framework)
                Console.WriteLine($"Error sending email: {ex.Message}");
                return false;
            }
        }
    
    }
}