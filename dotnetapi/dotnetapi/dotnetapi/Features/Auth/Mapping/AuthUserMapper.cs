using dotnetapi.Features.Auth.Data;
using dotnetapi.Models.Entities;

namespace dotnetapi.Features.Auth.Mapping;

public static class AuthUserMapper
{
    public static CurrentAuthUserDto ToCurrentUserDto(this AppUser request)
    {
        return new CurrentAuthUserDto
        {
            DisplayName = request.DisplayName,
            FirstName = request.FirstName,
            LastName = request.LastName,
            PhotoUrl = request.PhotoUrl
        };
    }
}