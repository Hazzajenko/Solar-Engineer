using EventBus.Domain.AppUserEvents;
using Infrastructure.Common;
using Users.API.Entities;

namespace Users.API.Mapping;

public static class UserMapper
{
    public static User ToUser(this IAppUserEvent request)
    {
        return new User
        {
            Id = Guid.Parse(request.AppUser.Id),
            CreatedTime = request.AppUser.CreatedTime,
            LastModifiedTime = DateTime.Now,
            FirstName = request.AppUser.FirstName,
            LastName = request.AppUser.LastName,
            DisplayName = request.AppUser.DisplayName,
            PhotoUrl = request.AppUser.PhotoUrl,
            LastActiveTime = request.AppUser.LastActiveTime
        };
    }

    public static T ToCustomUser<T>(this IAppUserEvent request) where T : IUser, new()
    {
        return new T
        {
            Id = Guid.Parse(request.AppUser.Id),
            CreatedTime = request.AppUser.CreatedTime,
            LastModifiedTime = DateTime.Now,
            FirstName = request.AppUser.FirstName,
            LastName = request.AppUser.LastName,
            DisplayName = request.AppUser.DisplayName,
            PhotoUrl = request.AppUser.PhotoUrl,
            LastActiveTime = request.AppUser.LastActiveTime
        };
    }
}

// IUser