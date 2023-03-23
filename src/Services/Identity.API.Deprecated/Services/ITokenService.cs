using IdentityModel.Client;

namespace Identity.API.Deprecated.Services;

public interface ITokenService
{
    Task<TokenResponse> GetToken(string scope);
}