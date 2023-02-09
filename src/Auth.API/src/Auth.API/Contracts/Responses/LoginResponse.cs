using Auth.API.Data;

namespace Auth.API.Contracts.Responses;

public class LoginResponse
{
    public CurrentUserDto User { get; set; } = default!;
}