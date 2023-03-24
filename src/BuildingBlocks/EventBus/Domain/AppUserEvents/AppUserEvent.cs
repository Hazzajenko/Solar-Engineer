using Infrastructure.Contracts.Data;

// using Infrastructure.Entities.Identity;

namespace EventBus.Domain.AppUserEvents;

public class AppUserEvent : IEventBase, IAppUserEvent
{
    /*public AppUserEvent(IUser appUser, string eventType)
    {
        User = appUser.ToDto();
        EventType = eventType;
        Queues = new List<string> { "messages", "projects" };
        CreatedAt = DateTime.Now;
    }*/

    public AppUserEvent(UserDto appUser, AppUserEventType appUserEventType)
    {
        User = appUser;
        EventType = "";
        AppUserEventType = appUserEventType;
        Queues = new List<string> { "messages", "projects" };
        CreatedAt = DateTime.Now;
    }

    public AppUserEventType AppUserEventType { get; set; }

    public UserDto User { get; set; }
    public string EventType { get; }

    // public string EventType { get; }
    public DateTime CreatedAt { get; }
    public List<string> Queues { get; set; }
}