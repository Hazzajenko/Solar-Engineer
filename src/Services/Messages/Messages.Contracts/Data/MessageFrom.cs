using Ardalis.SmartEnum;

namespace Messages.Contracts.Data;

/*public enum MessageFrom
{
    Unknown,
    OtherUser,
    CurrentUser,
    Server
}*/

public sealed class MessageFrom : SmartEnum<MessageFrom>
{
    public static readonly MessageFrom Unknown = new(nameof(Unknown), 1);
    public static readonly MessageFrom OtherUser = new(nameof(OtherUser), 2);

    public static readonly MessageFrom CurrentUser = new(nameof(CurrentUser), 3);
    public static readonly MessageFrom Server = new(nameof(Server), 4);

    private MessageFrom(string name, int value)
        : base(name, value) { }
}
