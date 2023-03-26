using Serilog;

namespace Infrastructure.Helpers;

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
        Log.Logger.Information("Method {@Method}", method);
        try
        {
            var genericMethod = method.MakeGenericMethod(types);
            return genericMethod.Invoke(null, parameters)!;
        }
        catch (Exception e)
        {
            Log.Logger.Error(e, "Error in InvokeStaticGenericMethod");
            throw;
        }
    }
}