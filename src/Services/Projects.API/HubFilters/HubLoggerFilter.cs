using Infrastructure.Logging;
using Microsoft.AspNetCore.SignalR;
using Serilog;

namespace Projects.API.HubFilters;

public class HubLoggerFilter : IHubFilter
{
    public async ValueTask<object?> InvokeMethodAsync(
        HubInvocationContext invocationContext,
        Func<HubInvocationContext, ValueTask<object?>> next
    )
    {
        var userId = invocationContext.Context.GetGuidUserId();
        // invocationContext.Context.Features.Get<IUserIdProvider>();
        // invocationContext.HubMethodArguments.;
        Log.Logger.Information(
            "User {UserId}: Calling hub method {HubMethodName}",
            userId,
            invocationContext.HubMethodName
        );
        if (invocationContext.HubMethodName == "SendProjectEvent")
        {
            var arguments = invocationContext.HubMethodArguments.ToArray();

            // arguments[languageFilter.FilterArgument] = str;
            // arguments[0].DumpObjectJson();
            Log.Logger.Information(
                "User {UserId}: Calling hub method {HubMethodName} with argument {Argument}",
                userId,
                invocationContext.HubMethodName,
                arguments[0]
            );
        }

        if (invocationContext.HubMethodArguments.Any())
            invocationContext.HubMethodArguments
                .ToList()
                .ForEach(arg =>
                {
                    if (arg != null) arg.DumpObjectJson();
                    /*Log.Logger.Information(
                        "User {UserId}: Calling hub method {HubMethodName} with argument {Argument}",
                        userId,
                        invocationContext.HubMethodName,
                        arg
                    );*/
                });
        /*Log.Logger.Information(
            "Calling hub method {HubMethodName}",
            invocationContext.HubMethodName
        );*/
        // Console.WriteLine($"Calling hub method '{invocationContext.HubMethodName}'");
        // invocationContext.Context.GetGuidUserId();
        // invocationContext.ServiceProvider.
        try
        {
            return await next(invocationContext);
        }
        catch (Exception ex)
        {
            // Console.WriteLine($"Exception calling '{invocationContext.HubMethodName}': {ex}");
            Log.Logger.Error(
                ex,
                "User {UserId}: Exception calling hub method {HubMethodName}",
                userId,
                invocationContext.HubMethodName
            );
            // Log.Logger.Error("{StackTrace}", ex.);

            throw;
        }
    }

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