namespace Auth.API.Contracts.Data;

public class TokenResponse
{
    public string Token { get; set; } = default!;
    public string DisplayName { get; set; } = default!;
    public DateTime Expires { get; init; } = default!;
}