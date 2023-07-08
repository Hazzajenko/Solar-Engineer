using ApplicationCore.Entities;
using ApplicationCore.Extensions;
using ApplicationCore.Interfaces;
using Identity.Application.Data.UnitOfWork;
using Identity.Application.Services.Connections;
using Identity.Domain;
using Infrastructure.OpenTelemetry;
using Infrastructure.SignalR;
using Microsoft.ApplicationInsights;
using Microsoft.ApplicationInsights.DataContracts;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace Identity.Application.HubFilters;

public class UsersHubFilter : IHubFilter
{
    public async ValueTask<object?> InvokeMethodAsync(
        HubInvocationContext invocationContext,
        Func<HubInvocationContext, ValueTask<object?>> next
    )
    {
        var logger = invocationContext.ServiceProvider.GetService<ILogger<UsersHubFilter>>()!;
        var authUser = invocationContext.Context.ToAuthUser();
        logger.LogInformation(
            "User {UserName}: Calling hub method {HubMethodName}",
            authUser.UserName,
            invocationContext.HubMethodName
        );
        var unitOfWork = invocationContext.ServiceProvider.GetService<IIdentityUnitOfWork>();
        if (unitOfWork is null)
        {
            logger.LogError("IdentityUnitOfWork is null");
            return await HandleNext(invocationContext, next, authUser, logger);
        }
        AppUser appUser = await unitOfWork.AppUsersRepository.GetCurrentUserAsync(
            invocationContext.Context
        );
        appUser.LastActiveTime = DateTime.UtcNow;
        await unitOfWork.AppUsersRepository.UpdateAsync(appUser);
        await unitOfWork.SaveChangesAsync();

        var telemetryClient = invocationContext.ServiceProvider.GetService<TelemetryClient>();
        if (telemetryClient is null)
        {
            logger.LogError("TelemetryClient is null");
            return await HandleNext(invocationContext, next, authUser, logger);
        }

        var connectionsService =
            invocationContext.ServiceProvider.GetService<IConnectionsService>();
        if (connectionsService is null)
        {
            logger.LogError("ConnectionsService is null");
            return await HandleNext(invocationContext, next, authUser, logger, telemetryClient);
        }

        connectionsService.UpdateLastActiveTime(appUser.Id);

        return await HandleNext(invocationContext, next, authUser, logger, telemetryClient);
    }

    private static async ValueTask<object?> HandleNext(
        HubInvocationContext invocationContext,
        Func<HubInvocationContext, ValueTask<object?>> next,
        IUser authUser,
        ILogger logger,
        TelemetryClient? telemetryClient = null
    )
    {
        var state = new Dictionary<string, object>
        {
            ["UserId"] = authUser.Id,
            ["UserName"] = authUser.UserName,
            ["IsAuthenticated"] = true,
            ["ConnectionId"] = invocationContext.Context.ConnectionId,
            ["HubMethodName"] = invocationContext.HubMethodName,
        };
        RequestTelemetry? requestTelemetry = telemetryClient?.GetRequestTelemetry(
            authUser,
            state.ToStringDictionary()
        );
        using var operation = telemetryClient.StartOperation(requestTelemetry);
        using IDisposable? scope = logger.BeginScope(state);

        return await next(invocationContext);
    }
}
