using IdentityModel.Client;

namespace Identity.API.Services;

public interface ITokenService
{
    Task<TokenResponse> GetToken(string scope);
}