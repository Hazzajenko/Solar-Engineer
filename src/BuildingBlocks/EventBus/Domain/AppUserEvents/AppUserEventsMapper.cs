using Infrastructure.Common;

namespace EventBus.Domain.AppUserEvents;

public static class AppUserEventsMapper
{
    public static T ToUser<T>(this IAppUserEvent request) where T : IUser, new()
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