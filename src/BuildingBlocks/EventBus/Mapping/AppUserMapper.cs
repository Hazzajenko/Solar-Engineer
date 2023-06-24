using ApplicationCore.Interfaces;
using EventBus.Domain.AppUserEvents;

// using Infrastructure.Entities.Identity;

namespace EventBus.Mapping;

public static class AppUserMapper
{
    public static AppUserEventFactory ToEvent(this IAppUser request)
    {
        return new AppUserEventFactory
            (request);
    }
}