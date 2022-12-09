using dotnetapi.Models.Dtos;
using dotnetapi.Models.Entities;

namespace dotnetapi.Services;

public interface IUsersService
{
    // Task<string> CreateToken(AppUser user);
    Task<AppUserDto> HandleSignIn(AppUser request);
}