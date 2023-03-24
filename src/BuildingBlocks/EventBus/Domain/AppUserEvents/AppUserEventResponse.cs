// using Infrastructure.Entities.Identity;

namespace EventBus.Domain.AppUserEvents;

public class AppUserEventResponse
{
    public AppUserEventResponse(
        AppUserEventType appUserEventType,
        string message,
        bool success = true
    )
    {
        AppUserEventType = appUserEventType;
        Message = message;
        Success = success;
    }

    public AppUserEventType AppUserEventType { get; set; }
    public bool Success { get; set; }
    public string Message { get; set; }

    /*
    public UserDto User { get; set; }
    public string EventType { get; }
    public DateTime CreatedAt { get; }
    public List<string> Queues { get; set; }*/
}