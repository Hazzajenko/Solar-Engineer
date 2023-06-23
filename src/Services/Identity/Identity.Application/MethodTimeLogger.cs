using System.Reflection;

namespace Identity.Application;

public static class MethodTimeLogger
{
    public static readonly List<MethodBase> MethodBase = new();
    public static readonly List<string> Messages = new();

    public static void Log(MethodBase methodBase, long milliseconds, string message)
    {
        Console.WriteLine($"{methodBase.Name} {milliseconds}: {message}");

        MethodBase.Add(methodBase);

        // ReSharper disable once ConditionIsAlwaysTrueOrFalseAccordingToNullableAPIContract
        if (message is not null)
        {
            Messages.Add(message);
        }
    }
}
