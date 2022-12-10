using dotnetapi.Models.Entities;

namespace dotnetapi.Services;

public interface IAuthService
{
    // Task<string> CreateToken(AppUser user);
    Task<LoginResponse> HandleSignIn(AppUser request);
}