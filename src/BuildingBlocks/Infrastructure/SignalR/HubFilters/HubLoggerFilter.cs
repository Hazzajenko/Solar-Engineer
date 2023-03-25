using Infrastructure.Logging;
using Microsoft.AspNetCore.SignalR;
using Serilog;

namespace Infrastructure.SignalR.HubFilters;

public class HubLoggerFilter : IHubFilter
{
    public async ValueTask<object?> InvokeMethodAsync(
        HubInvocationContext invocationContext,
        Func<HubInvocationContext, ValueTask<object?>> next
    )
    {
        var userId = invocationContext.Context.GetGuidUserId();
        Log.Logger.Information(
            "User {UserId}: Calling hub method {HubMethodName}",
            userId,
            invocationContext.HubMethodName
        );

        if (invocationContext.HubMethodArguments.Any())
            invocationContext.HubMethodArguments
                .ToList()
                .ForEach(arg =>
                {
                    if (arg != null)
                        arg.DumpObjectJson();
                });
        try
        {
            return await next(invocationContext);
        }
        catch (Exception ex)
        {
            Log.Logger.Error(
                ex,
                "User {UserId}: Exception calling hub method {HubMethodName}",
                userId,
                invocationContext.HubMethodName
            );

            throw;
        }
    }

    /*
    public Task OnConnectedAsync(HubLifetimeContext context, Func<HubLifetimeContext, Task> next)
    {
        var userId = context.Context.GetGuidUserId();
        // invocationContext.Context.Features.Get<IUserIdProvider>();
        // invocationContext.HubMethodArguments.;
        Log.Logger.Information(
            "User {UserId} connected",
            userId
            // context.Context.
        );

        return next(context);
    }

    /#1#/ Optional method
    public Task OnConnectedAsync(HubLifetimeContext context, Func<HubLifetimeContext, Task> next)
    {
        return next(context);
    }

    // Optional method
    public Task OnDisconnectedAsync(
        HubLifetimeContext context, Exception exception, Func<HubLifetimeContext, Exception, Task> next)
    {
        return next(context, exception);
    }#1#*/
}