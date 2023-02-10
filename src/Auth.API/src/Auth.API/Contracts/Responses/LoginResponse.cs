using Auth.API.Contracts.Data;

namespace Auth.API.Contracts.Responses;

public class LoginResponse
{
    public CurrentUserDto User { get; set; } = default!;
}