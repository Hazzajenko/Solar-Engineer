using Infrastructure.Contracts.Data;

namespace EventBus.Domain.AppUserEvents.Events;

public class AppUserLoggedInEvent : AppUserEvent
{
    public AppUserLoggedInEvent(UserDto user)
    {
        User = user;
    }

    // public UserDto User { get; set; }
}