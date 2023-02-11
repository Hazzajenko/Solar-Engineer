using Auth.API.Contracts.Data;
using Auth.API.Domain;

namespace Auth.API.Mapping;

public static class AppUserMapper
{
    public static CurrentUserDto ToCurrentUserDto(this AppUser request)
    {
        return new CurrentUserDto
        {
            Id = request.Id,
            DisplayName = request.DisplayName,
            FirstName = request.FirstName,
            LastName = request.LastName,
            PhotoUrl = request.PhotoUrl
        };
    }
}