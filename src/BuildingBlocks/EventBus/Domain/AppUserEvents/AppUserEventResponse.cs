// using Infrastructure.Entities.Identity;

using Infrastructure.Contracts.Data;

namespace EventBus.Domain.AppUserEvents;

/*public class AppUserEventResponse
{
    public AppUserEventResponse(
        EventResponseType eventResponseType,
        UserDto? user,
        bool success = true
    )
    {
        EventResponseType = eventResponseType;
        User = user;
        Success = success;
    }

    public EventResponseType EventResponseType { get; set; }
    public UserDto? User { get; set; }

    public bool Success { get; set; }
    // public string Message { get; set; }

    /*
    public UserDto User { get; set; }
    public string EventType { get; }
    public DateTime CreatedAt { get; }
    public List<string> Queues { get; set; }#1#
}*/

public interface IAppUserEventMessage
{
    // Guid Id { get; init; }
    Guid UserId { get; init; }
}

public record AppUserEventResponse(
    // Guid Id,
    Guid UserId,
    EventResponseType EventResponseType,
    UserDto? User,
    bool Success = true
) : IAppUserEventMessage;