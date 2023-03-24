using Infrastructure.Contracts.Data;

namespace EventBus.Domain.AppUserEvents.Events;

public class AppUserModifiedEventDeprecated : AppUserEventDeprecated
{
    public AppUserModifiedEventDeprecated(UserDto user)
    {
        User = user;
    }

    // public UserDto User { get; set; }
}