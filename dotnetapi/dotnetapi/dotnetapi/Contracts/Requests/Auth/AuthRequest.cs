namespace dotnetapi.Contracts.Requests.Auth;

public class AuthRequest
{
    public string UserName { get; set; } = default!;
    public string Password { get; set; } = default!;
}