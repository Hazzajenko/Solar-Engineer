using Ardalis.SmartEnum;
namespace Messages.Contracts.Data;


public sealed class EMessageFrom : SmartEnum<EMessageFrom>
{
    public static readonly EMessageFrom Unknown = new(nameof(Unknown), 1);
    public static readonly EMessageFrom OtherUser = new(nameof(OtherUser), 2);

    public static readonly EMessageFrom CurrentUser = new(nameof(CurrentUser), 3);
    public static readonly EMessageFrom Server = new(nameof(Server), 4);

    private EMessageFrom(string name, int value)
        : base(name, value) { }
}
