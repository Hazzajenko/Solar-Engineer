using Ardalis.SmartEnum;

namespace EventBus.Domain.AppUserEvents;

public class AppUserEventType : SmartEnum<AppUserEventType>
{
    public static readonly AppUserEventType Created = new(nameof(Created), 1);
    public static readonly AppUserEventType Updated = new(nameof(Updated), 2);
    public static readonly AppUserEventType LoggedIn = new(nameof(LoggedIn), 3);
    public static readonly AppUserEventType Deleted = new(nameof(Deleted), 4);

    public AppUserEventType(string name, int value)
        : base(name, value)
    {
    }
}