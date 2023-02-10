using Auth.API.Contracts.Data;

namespace Auth.API.Services;

public interface IAuthService
{
    Task<Auth0UserDto?> GetAuthUser(string sub);
}
