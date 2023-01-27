using System.Reflection;

namespace dotnetapi;

public static class MethodTimeLogger
{
    public static ILogger Logger;

    public static void Log(MethodBase methodBase, long milliseconds, string message)
    {
        Logger.LogInformation("{Class}.{Method} {Duration}ms", methodBase.DeclaringType!.Name, methodBase.Name,
            milliseconds);
    }
}