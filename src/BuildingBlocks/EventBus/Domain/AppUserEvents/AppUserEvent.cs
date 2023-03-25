using Infrastructure.Contracts.Data;

// using Infrastructure.Entities.Identity;

namespace EventBus.Domain.AppUserEvents;

public class AppUserEvent : IAppUserEvent
{
    public AppUserEvent(UserDto appUser, AppUserEventType appUserEventType)
    {
        User = appUser;
        AppUserEventType = appUserEventType;
        Queues = new List<string> { "messages", "projects" };
        CreatedAt = DateTime.Now;
    }

    public Guid Id { get; set; } = Guid.NewGuid();
    public AppUserEventType AppUserEventType { get; set; }
    public UserDto User { get; set; }
    public DateTime CreatedAt { get; }
    public List<string> Queues { get; set; }
}