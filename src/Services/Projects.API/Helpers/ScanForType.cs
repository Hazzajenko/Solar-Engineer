using Serilog;

namespace Projects.API.Helpers;

public static partial class Helpers
{
    public static Type ScanForType(Type interfaceType, string typeName)
    {
        try
        {
            return typeof(IApiAssemblyMarker).Assembly.DefinedTypes
                .Where(x => interfaceType.IsAssignableFrom(x) && x is { IsInterface: false })
                .ToDictionary(type => type.Name, type => type.AsType())
                .SingleOrDefault(x => x.Key == typeName)
                .Value;
        }
        catch (Exception e)
        {
            Log.Logger.Error(
                e,
                "Error in ScanForType: {TypeName}, {Interface} ",
                typeName,
                interfaceType.Name
            );
            throw;
        }
        /*return typeof(IApiAssemblyMarker).Assembly.DefinedTypes
            .Where(x => interfaceType.IsAssignableFrom(x) && x is { IsInterface: false })
            .ToDictionary(type => type.Name, type => type.AsType())
            .SingleOrDefault(x => x.Key == typeName)
            .Value;*/
    }
}