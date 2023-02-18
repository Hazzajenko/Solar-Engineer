using Infrastructure.Contracts.Data;

namespace EventBus.Domain.AppUserEvents.Events;

public class AppUserCreatedEvent : AppUserEvent
{
    public AppUserCreatedEvent(UserDto user)
    {
        User = user;
    }

    // public UserDto User { get; set; }
}