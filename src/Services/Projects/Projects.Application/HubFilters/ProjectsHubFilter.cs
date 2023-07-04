using Infrastructure.Logging;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.DependencyInjection;
using Serilog;

namespace Projects.Application.HubFilters;

public class ProjectsHubFilter : IHubFilter
{
    public async ValueTask<object?> InvokeMethodAsync(
        HubInvocationContext invocationContext,
        Func<HubInvocationContext, ValueTask<object?>> next
    )
    {
        Log.Logger.Information(
            "ProjectsHubFilter, {HubMethodName}",
            invocationContext.HubMethodName
        );
        var hubMethodName = invocationContext.HubMethodName;
        if (hubMethodName.Equals("SendProjectEvent")) { }
        return await HandleNext(invocationContext, next);
    }

    private async ValueTask<object?> HandleNextSendProjectEvent(
        HubInvocationContext invocationContext,
        Func<HubInvocationContext, ValueTask<object?>> next
    )
    {
        try
        {
            return await next(invocationContext);
        }
        catch (Exception ex)
        {
            if (invocationContext.HubMethodArguments.Any() is false)
            {
                Log.Logger.Error(
                    ex,
                    "Exception calling hub method {HubMethodName} with no arguments",
                    invocationContext.HubMethodName
                );

                throw;
            }

            invocationContext.HubMethodArguments
                .ToList()
                .ForEach(arg =>
                {
                    arg?.DumpObjectJson();
                    Log.Logger.Error(
                        ex,
                        "Exception calling hub method {HubMethodName} with argument {HubMethodArgument}",
                        invocationContext.HubMethodName,
                        arg
                    );
                });
            Log.Logger.Error(
                ex,
                "Exception calling hub method {HubMethodName}",
                invocationContext.HubMethodName
            );

            throw;
        }
    }

    private async ValueTask<object?> HandleNext(
        HubInvocationContext invocationContext,
        Func<HubInvocationContext, ValueTask<object?>> next,
        Guid? userId = null
    )
    {
        try
        {
            return await next(invocationContext);
        }
        catch (Exception ex)
        {
            if (userId is null)
            {
                Log.Logger.Error(
                    ex,
                    "Unauthenticated User: Exception calling hub method {HubMethodName}",
                    invocationContext.HubMethodName
                );
                throw;
            }
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
