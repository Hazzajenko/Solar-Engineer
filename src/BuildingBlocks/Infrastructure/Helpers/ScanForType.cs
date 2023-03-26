using Serilog;

namespace Infrastructure.Helpers;

public static partial class Helpers
{
    public static Type ScanForType(Type assemblyMarker, Type interfaceType, string typeName)
    {
        try
        {
            return assemblyMarker.Assembly.DefinedTypes
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
    }
}