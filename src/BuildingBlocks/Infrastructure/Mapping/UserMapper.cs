using ApplicationCore.Contracts.Data;
using ApplicationCore.Interfaces;

// using Infrastructure.Entities.Identity;

// using AppUser = Users.API.Entities.AppUser;

namespace Infrastructure.Mapping;

public static class UserMapper
{
    public static T ToEntity<T>(this UserDto request)
        where T : IAppUser, new()
    {
        return new T
        {
            Id = request.Id,
            FirstName = request.FirstName,
            LastName = request.LastName,
            DisplayName = request.DisplayName,
            CreatedTime = request.CreatedTime,
            // LastActiveTime = request.LastActiveTime,
            PhotoUrl = request.PhotoUrl
        };
    }

    /*public static UserDto ToDto<T>(this T request)
        where T : IAppUser
    {
        return new UserDto
        {
            Id = request.Id,
            FirstName = request.FirstName,
            LastName = request.LastName,
            UserName = request.UserName,
            DisplayName = request.DisplayName,
            PhotoUrl = request.PhotoUrl,
            CreatedTime = request.CreatedTime,
            LastModifiedTime = request.LastModifiedTime
            // LastActiveTime = request.LastActiveTime
        };
    }*/
}
