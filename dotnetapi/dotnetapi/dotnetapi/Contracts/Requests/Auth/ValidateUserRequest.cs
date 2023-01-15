namespace dotnetapi.Contracts.Requests.Auth;

public class ValidateUserRequest
{
    public string Email { get; set; } = default!;
    public string Username { get; set; } = default!;
}