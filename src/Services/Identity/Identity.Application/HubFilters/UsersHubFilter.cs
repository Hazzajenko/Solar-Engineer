using Identity.Application.Data.UnitOfWork;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.SignalR;
using Serilog;

namespace Identity.Application.HubFilters;

public class UsersHubFilter : IHubFilter
{
    public async ValueTask<object?> InvokeMethodAsync(
        HubInvocationContext invocationContext,
        Func<HubInvocationContext, ValueTask<object?>> next
    )
    {
        Log.Logger.Information("UsersHubFilter");
        var unitOfWork = invocationContext.ServiceProvider.GetService<IIdentityUnitOfWork>();
        if (unitOfWork is null)
        {
            Log.Logger.Error("IdentityUnitOfWork is null");
            return await HandleNext(invocationContext, next);
        }
        var appUser = await unitOfWork.AppUsersRepository.GetCurrentUserAsync(
            invocationContext.Context
        );
        Log.Logger.Information(
            "UsersHubFilter, AppUser: {AppUserId} - {AppUserUserName}",
            appUser.Id,
            appUser.UserName
        );
        appUser.LastActiveTime = DateTime.Now;
        await unitOfWork.AppUsersRepository.UpdateAsync(appUser);
        await unitOfWork.SaveChangesAsync();

        return await HandleNext(invocationContext, next);
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
