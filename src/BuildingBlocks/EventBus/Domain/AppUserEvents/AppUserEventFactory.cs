using Infrastructure.Common.User;
using Infrastructure.Contracts.Data;
using Infrastructure.Mapping;

// using Infrastructure.Entities.Identity;

namespace EventBus.Domain.AppUserEvents;

public class AppUserEventFactory : EventBase
{
    public AppUserEventFactory(IUser appUser)
    {
        UserDto = appUser.ToDto();
        Queues = new List<string> { "messages", "projects" };
    }

    public AppUserEventFactory(UserDto appUser)
    {
        UserDto = appUser;
        Queues = new List<string> { "messages", "projects" };
    }

    private UserDto UserDto { get; }

    /*
    public AppUserCreatedEventDeprecated Created()
    {
        return new AppUserCreatedEventDeprecated(UserDto);
    }

    public AppUserLoggedInEventDeprecated LoggedIn()
    {
        return new AppUserLoggedInEventDeprecated(UserDto);
    }

    public AppUserModifiedEventDeprecated Modified()
    {
        return new AppUserModifiedEventDeprecated(UserDto);
    }*/
}