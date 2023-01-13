namespace dotnetapi.Contracts.Requests.Auth;

public class AuthRequest
{
    public string Username { get; set; } = default!;
    public string Password { get; set; } = default!;
}