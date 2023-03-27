using EventBus.Common;
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

public interface IAppUserEventV2
{
    Guid Id { get; }

    // TEvent Event { get; set; }
    DateTime CreatedAt { get; }
    // List<string> Queues { get; }
}

public class QueueResponse
{
    public string Name { get; set; } = default!;
    public bool Success { get; set; } = false;
    public DateTime? CompletedAt { get; set; }
    public string? Error { get; set; }
}

/*public static class QueueRoutes
{
    public const string Messages = "messages";
    public const string Projects = "projects";
}*/

public class AppUserEventV2 : IAppUserEventV2
{
    public AppUserEventV2(Guid id, object @event)
    {
        Event = @event;
        Id = id;
        Queues = new List<QueueResponse>
        {
            new() { Name = ServiceConst.Messages },
            new() { Name = ServiceConst.Projects }
        };
        CreatedAt = DateTime.Now;
    }

    public List<QueueResponse> Queues { get; set; }

    public object Event { get; set; }

    // public UserDto User { get; set; }
    public DateTime CreatedAt { get; }

    // public List<string> Queues { get; set; }

    public Guid Id { get; } /* = Guid.NewGuid();*/
}

/*{
    public AppUserEventV2(UserDto appUser)
    {

    }

}*/

public record AppUserEvent(Guid UserId, UserDto User, AppUserEventType AppUserEventType)
    : IAppUserEvent,
        IAppUserEventMessage
{
    public DateTime CreatedAt { get; } = DateTime.UtcNow;

    public List<string> Queues { get; set; } = new() { "messages", "projects" };

    public Guid Id { get; } = Guid.NewGuid();
    // public Guid Id { get; init; } = Guid.NewGuid();
}

public record AppUserCreated(Guid Id, UserDto User) : IAppUserEvent
{
    // public Guid Id { get; } = Guid.NewGuid();
    // public DateTime CreatedAt { get; } = DateTime.UtcNow;
    // public List<string> Queues { get; set; } = new() { "messages", "projects" };
}