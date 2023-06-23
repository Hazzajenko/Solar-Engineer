using System.Reflection;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Logging;

public static class MethodTimeLogger
{
    public static ILogger Logger = null!;

    public static void Log(MethodBase methodBase, long milliseconds, string message)
    {
        Logger.LogInformation(
            "{Class}.{Method} {Duration}ms",
            methodBase.DeclaringType!.Name,
            methodBase.Name,
            milliseconds
        );
    }
}
