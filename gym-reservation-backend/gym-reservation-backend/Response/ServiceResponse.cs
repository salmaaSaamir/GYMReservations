namespace gym_reservation_backend.Response
{
    public class ServiceResponse
    {
        public bool State { get; set; }
        public string ErrorMessage { get; set; } = string.Empty;
        public string SuccessMessage { get; set; } = string.Empty;
        public List<object> Data { get; set; } = new List<object> { };
        public string? token { get; set; }

        public ServiceResponse()
        {
            State = false;
            ErrorMessage = "Validation Error";
            Data = new List<object>();
        }

        public ServiceResponse(string error)
        {
            State = false;
            Data = new List<object>();
            ErrorMessage = error;
        }

    }
}
