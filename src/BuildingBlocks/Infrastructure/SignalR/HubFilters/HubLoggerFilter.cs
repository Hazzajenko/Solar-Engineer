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
}