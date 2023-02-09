using dotnetapi.Features.Users.Data;
using dotnetapi.Models.Entities;

namespace dotnetapi.Features.Users.Mapping;

public static class UserMapper
{
    public static GetUserDto ToGetUserDto(this AppUser request)
    {
        return new GetUserDto
        {
            Id = request.Id,
            DisplayName = request.DisplayName!,
            FirstName = request.FirstName,
            LastName = request.LastName,
            PhotoUrl = request.PhotoUrl,
            Created = request.Created,
            LastActive = request.LastActive
        };
    }
}