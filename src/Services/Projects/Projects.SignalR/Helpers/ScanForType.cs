using Projects.Contracts;
using Serilog;

namespace Projects.SignalR.Helpers;

public static partial class Helpers
{
    /**
     * * Scans the assembly for a type that the projects hub receives as a parameter
     */
    public static Type ScanForContracts(Type interfaceType, string typeName)
    {
        try
        {
            return typeof(IProjectsContractsAssemblyMarker).Assembly.DefinedTypes
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

    /**
     * * Scans the assembly for a type that the projects hub receives as a parameter
     */
    public static Type ScanForCommands(Type interfaceType, string typeName)
    {
        try
        {
            return typeof(IProjectsSignalrAssemblyMarker).Assembly.DefinedTypes
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