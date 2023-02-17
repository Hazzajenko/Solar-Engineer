using Infrastructure.Common;

namespace EventBus.Domain.AppUserEvents;

public static class AppUserEventsMapper
{
    public static T ToUser<T>(this IAppUserEvent request) where T : IUser, new()
    {
        return new T
        {
            Id = request.User.Id,
            CreatedTime = request.User.CreatedTime,
            LastModifiedTime = DateTime.Now,
            FirstName = request.User.FirstName,
            LastName = request.User.LastName,
            DisplayName = request.User.DisplayName,
            PhotoUrl = request.User.PhotoUrl,
            LastActiveTime = request.User.LastActiveTime
        };
    }
}