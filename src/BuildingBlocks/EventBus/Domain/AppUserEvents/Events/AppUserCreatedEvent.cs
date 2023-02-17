using Infrastructure.Contracts.Data;

namespace EventBus.Domain.AppUserEvents.Events;

public class AppUserCreatedEvent : EventBase, IAppUserEvent
{
    public AppUserCreatedEvent(UserDto user)
    {
        User = user;
    }

    public UserDto User { get; set; }
}