using Infrastructure.Contracts.Data;

namespace EventBus.Domain.AppUserEvents.Events;

public class AppUserCreatedEvent : EventBase, IAppUserEvent
{
    public AppUserCreatedEvent(AppUserDto appUser)
    {
        AppUser = appUser;
    }

    public AppUserDto AppUser { get; set; }
}