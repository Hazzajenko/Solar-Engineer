using ApplicationCore.Entities;
using Identity.Application.Data.UnitOfWork;
using Identity.Application.Services.Connections;
using Identity.Domain;
using Infrastructure.SignalR;
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

        var connectionsService =
            invocationContext.ServiceProvider.GetService<IConnectionsService>();
        if (connectionsService is null)
        {
            logger.LogError("ConnectionsService is null");
            return await HandleNext(invocationContext, next, authUser, logger);
        }

        connectionsService.UpdateLastActiveTime(appUser.Id);

        return await HandleNext(invocationContext, next, authUser, logger);
    }

    private async ValueTask<object?> HandleNext(
        HubInvocationContext invocationContext,
        Func<HubInvocationContext, ValueTask<object?>> next,
        AuthUser authUser,
        ILogger logger
    )
    {
        using (
            logger.BeginScope(
                new Dictionary<string, object>
                {
                    ["UserId"] = authUser.Id,
                    ["UserName"] = authUser.UserName,
                    ["IsAuthenticated"] = true,
                    ["ConnectionId"] = invocationContext.Context.ConnectionId,
                    ["HubMethodName"] = invocationContext.HubMethodName,
                }
            )
        )
        {
            return await next(invocationContext);
        }
    }
}
