namespace EventBus.Domain;

public abstract class EventBase : IEventBase
{
    public string EventType => GetType().Name;
    // public string EventType => GetType().FullName!;
    public DateTime CreatedAt { get; } = DateTime.UtcNow;
    public List<string> Queues { get; set; } = new ();
}