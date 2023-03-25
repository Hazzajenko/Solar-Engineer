using Ardalis.SmartEnum;

namespace EventBus.Domain;

public class EventResponseType : SmartEnum<EventResponseType>
{
    public static readonly EventResponseType Created = new(nameof(Created), 1);
    public static readonly EventResponseType Updated = new(nameof(Updated), 2);
    public static readonly EventResponseType NoChange = new(nameof(Updated), 3);
    public static readonly EventResponseType Deleted = new(nameof(Deleted), 4);

    public EventResponseType(string name, int value)
        : base(name, value)
    {
    }
}