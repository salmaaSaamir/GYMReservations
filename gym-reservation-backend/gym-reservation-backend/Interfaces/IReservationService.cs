using gym_reservation_backend.Models;
using gym_reservation_backend.Response;

namespace gym_reservation_backend.Interfaces
{
    public interface IReservationService
    {
        Task<ServiceResponse> GetReservations(int page = 1, int pageSize = 20);
        Task<bool> Delete(int ReservationId);
        Task<ServiceResponse> SaveReservation(Reservation reservation);
        Task<ServiceResponse> CheckClassAvailability(int classId);
       Task<ServiceResponse> CheckMemberReservation(int classId, int memberId,  string classDay);
    }
}
