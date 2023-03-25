namespace EventBus.Domain;

public interface IEventBase
{
    string EventType { get; }
    DateTime CreatedAt { get; }
    List<string> Queues { get; }
}