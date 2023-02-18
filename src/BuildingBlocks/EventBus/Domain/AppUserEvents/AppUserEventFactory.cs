using EventBus.Domain.AppUserEvents.Events;
using Infrastructure.Common;
using Infrastructure.Contracts.Data;
using Infrastructure.Mapping;
// using Infrastructure.Entities.Identity;

namespace EventBus.Domain.AppUserEvents;

public class AppUserEventFactory : EventBase
{
    public AppUserEventFactory(IUser appUser)
    {
        UserDto = appUser.ToDto();
        Queues = new List<string>
        {
            "users", "messages"
        };
    }

    private UserDto UserDto { get; }
    

    public AppUserCreatedEvent Created()
    {
        return new AppUserCreatedEvent(UserDto);
    }

    public AppUserLoggedInEvent LoggedIn()
    {
        return new AppUserLoggedInEvent(UserDto);
    }

    public AppUserModifiedEvent Modified()
    {
        return new AppUserModifiedEvent(UserDto);
    }
}