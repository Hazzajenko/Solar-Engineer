using Ardalis.SmartEnum;

namespace EventBus.Common;

public class ServiceName : SmartEnum<ServiceName>
{
    public static readonly ServiceName Identity = new(nameof(Identity), 1);
    public static readonly ServiceName Projects = new(nameof(Projects), 2);
    public static readonly ServiceName Messages = new(nameof(Messages), 3);

    public ServiceName(string name, int value)
        : base(name, value)
    {
    }
}