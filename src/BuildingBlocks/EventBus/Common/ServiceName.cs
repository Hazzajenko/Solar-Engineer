using Ardalis.SmartEnum;

namespace EventBus.Common;

public class ServiceName : SmartEnum<ServiceName>
{
    public static readonly ServiceName Identity = new(ServiceConst.Identity, 1);
    public static readonly ServiceName Projects = new(ServiceConst.Projects, 2);
    public static readonly ServiceName Messages = new(ServiceConst.Messages, 3);

    public ServiceName(string name, int value)
        : base(name, value)
    {
    }
}