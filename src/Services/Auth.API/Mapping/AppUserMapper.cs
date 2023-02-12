using Auth.API.Contracts.Data;
using Infrastructure.Entities.Identity;

namespace Auth.API.Mapping;

public static class AppUserMapper
{
    public static CurrentUserDto ToCurrentUserDto(this AppUser request)
    {
        return new CurrentUserDto
        {
            Id = request.Id.ToString(),
            DisplayName = request.DisplayName,
            FirstName = request.FirstName,
            LastName = request.LastName,
            PhotoUrl = request.PhotoUrl
        };
    }
}