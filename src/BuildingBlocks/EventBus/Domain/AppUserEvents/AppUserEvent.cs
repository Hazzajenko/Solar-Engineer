using EventBus.Domain.AppUserEvents.Events;
using Infrastructure.Contracts.Data;
using Infrastructure.Entities.Identity;
using Infrastructure.Mapping;

namespace EventBus.Domain.AppUserEvents;

public class AppUserEvent
{
    public AppUserEvent(AppUser appUser)
    {
        AppUserDto = appUser.ToDto();
    }

    private AppUserDto AppUserDto { get; }

    public AppUserCreatedEvent Created()
    {
        return new AppUserCreatedEvent(AppUserDto);
    }
}