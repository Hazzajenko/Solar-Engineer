namespace EventBus.Domain;

public abstract class EventBase
{
    public string EventType => GetType().FullName!;
    public DateTime CreatedAt { get; } = DateTime.UtcNow;
}