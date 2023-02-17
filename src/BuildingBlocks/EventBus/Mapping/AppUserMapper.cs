using EventBus.Domain.AppUserEvents;
using Infrastructure.Common;

// using Infrastructure.Entities.Identity;

namespace EventBus.Mapping;

public static class AppUserMapper
{
    public static AppUserEvent ToEvent(this IUser request)
    {
        return new AppUserEvent
            (request);
    }
}