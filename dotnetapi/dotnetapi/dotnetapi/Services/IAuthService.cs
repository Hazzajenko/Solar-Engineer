using dotnetapi.Models.Entities;

namespace dotnetapi.Services;

public interface IUsersService
{
    // Task<string> CreateToken(AppUser user);
    Task<LoginResponse> HandleSignIn(AppUser request);
}