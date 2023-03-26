using Infrastructure.Contracts.Data;

// using Infrastructure.Entities.Identity;

namespace EventBus.Domain.AppUserEvents;

/*public class AppUserEvent : IAppUserEvent, IAppUserEventMessage
{
    public AppUserEvent(UserDto appUser, AppUserEventType appUserEventType)
    {
        User = appUser;
        AppUserEventType = appUserEventType;
        Queues = new List<string> { "messages", "projects" };
        CreatedAt = DateTime.Now;
    }

    public AppUserEventType AppUserEventType { get; set; }
    public UserDto User { get; set; }
    public DateTime CreatedAt { get; }
    public List<string> Queues { get; set; }

    public Guid Id { get; } = Guid.NewGuid();
}*/

public record AppUserEvent(Guid UserId, UserDto User, AppUserEventType AppUserEventType)
    : IAppUserEvent,
        IAppUserEventMessage
{
    public Guid Id { get; } = Guid.NewGuid();
    public DateTime CreatedAt { get; } = DateTime.UtcNow;

    public List<string> Queues { get; set; } = new() { "messages", "projects" };
    // public Guid Id { get; init; } = Guid.NewGuid();
}