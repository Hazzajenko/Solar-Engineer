namespace Identity.Contracts.Requests.Errors;

public class SendAppErrorRequest
{
    public string? Message { get; set; }
    public string? StackTrace { get; set; }
}
