namespace dotnetapi.Features.Auth.Contracts.Requests;

public class RefreshTokenRequest
{
    public string RefreshToken { get; set; } = default!;
}