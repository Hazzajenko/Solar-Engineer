using Microsoft.AspNetCore.SignalR;
using Serilog;

namespace Projects.API.HubFilters;

public class HubLoggerFilter : IHubFilter
{
    public async ValueTask<object?> InvokeMethodAsync(
        HubInvocationContext invocationContext, Func<HubInvocationContext, ValueTask<object?>> next)
    {
        Log.Logger.Information("Calling hub method {HubMethodName}", invocationContext.HubMethodName);
        // Console.WriteLine($"Calling hub method '{invocationContext.HubMethodName}'");
        try
        {
            return await next(invocationContext);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Exception calling '{invocationContext.HubMethodName}': {ex}");
            Log.Logger.Error(ex, "Exception calling hub method {HubMethodName}", invocationContext.HubMethodName);
            // Log.Logger.Error("{StackTrace}", ex.);

            throw;
        }
    }

    /*// Optional method
    public Task OnConnectedAsync(HubLifetimeContext context, Func<HubLifetimeContext, Task> next)
    {
        return next(context);
    }

    // Optional method
    public Task OnDisconnectedAsync(
        HubLifetimeContext context, Exception exception, Func<HubLifetimeContext, Exception, Task> next)
    {
        return next(context, exception);
    }*/
}