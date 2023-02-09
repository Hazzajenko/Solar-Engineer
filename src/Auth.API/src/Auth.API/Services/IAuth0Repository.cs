using Auth.API.Data;

namespace Auth.API.Services;

public interface IAuth0Repository
{
    Task<bool> GetAuth0Token();
    Task<Auth0UserDto?> GetAuthUser(string sub);
}
