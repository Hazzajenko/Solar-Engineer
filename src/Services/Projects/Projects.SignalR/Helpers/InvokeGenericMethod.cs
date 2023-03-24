using Serilog;

namespace Projects.SignalR.Helpers;

public static partial class Helpers
{
    public static object InvokeStaticGenericMethod(
        Type classType,
        string methodName,
        Type[] types,
        params object[] parameters
    )
    {
        var method =
            classType.GetMethod(methodName)
            ?? throw new Exception($"Method {methodName} not found");
        // var genericMethod = method.MakeGenericMethod(types);
        try
        {
            var genericMethod = method.MakeGenericMethod(types);
            return genericMethod.Invoke(null, parameters)!;
        }
        catch (Exception e)
        {
            Log.Logger.Error(e, "Error in InvokeStaticGenericMethod");
            // Console.WriteLine(e);
            throw;
        }
        /* ?? throw new ArgumentNullException("");*/
        // return genericMethod.Invoke(null, parameters);
    }
}