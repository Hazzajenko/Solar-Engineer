using System.Reflection;
using Serilog;

namespace Infrastructure.Helpers;

public static partial class Helpers
{
    /// <summary>
    ///     Scan for a type in the assembly of the assemblyMarker.
    ///     The type must implement the interfaceType.
    /// </summary>
    public static Type ScanForType(Assembly assemblyMarker, Type interfaceType, string typeName)
    {
        try
        {
            return assemblyMarker.DefinedTypes
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