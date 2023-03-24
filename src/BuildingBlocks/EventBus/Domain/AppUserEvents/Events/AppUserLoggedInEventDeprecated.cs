using Infrastructure.Contracts.Data;

namespace EventBus.Domain.AppUserEvents.Events;

public class AppUserLoggedInEventDeprecated : AppUserEventDeprecated
{
    public AppUserLoggedInEventDeprecated(UserDto user)
    {
        User = user;
    }

    // public UserDto User { get; set; }
}