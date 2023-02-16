using EventBus.Domain.AppUserEvents;
using Infrastructure.Entities.Identity;

namespace EventBus.Mapping;

public static class AppUserMapper
{
    public static AppUserEvent ToEvent(this AppUser request)
    {
        return new AppUserEvent
            (request);
    }
}