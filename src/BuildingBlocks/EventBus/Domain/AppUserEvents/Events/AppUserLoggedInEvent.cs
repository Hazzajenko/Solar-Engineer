using Infrastructure.Contracts.Data;

namespace EventBus.Domain.AppUserEvents.Events;

public class AppUserLoggedInEvent : EventBase, IAppUserEvent
{
    public AppUserLoggedInEvent(AppUserDto appUser)
    {
        AppUser = appUser;
    }

    public AppUserDto AppUser { get; set; }
}