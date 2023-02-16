using Infrastructure.Contracts.Data;

namespace EventBus.Domain.AppUserEvents.Events;

public class AppUserModifiedEvent : EventBase, IAppUserEvent
{
    public AppUserModifiedEvent(AppUserDto appUser)
    {
        AppUser = appUser;
    }

    public AppUserDto AppUser { get; set; }
}