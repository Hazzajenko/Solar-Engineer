using System.Diagnostics.CodeAnalysis;
using System.Linq.Expressions;
using Infrastructure.Authentication;
using Infrastructure.Extensions;
using Infrastructure.SignalR.HubFilters;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Serilog;

namespace Infrastructure.SignalR;

public static class SignalRExtensions
{
    public static IServiceCollection ConfigureSignalRWithRedis(
        this IServiceCollection services,
        IWebHostEnvironment env
    )
    {
        services
            .AddSignalR(options =>
            {
                options.DisableImplicitFromServicesParameters = true;
                if (env.IsDevelopment())
                    options.EnableDetailedErrors = true;

                options.AddFilter<HubLoggerFilter>();
            })
            // .AddMessagePackProtocol()
            .AddStackExchangeRedis(
                "localhost",
                options => { options.Configuration.ChannelPrefix = "SolarEngineerApp"; }
            );
        return services;
    }

    public static T ThrowNewHubExceptionIfNull<T>([NotNull] this T? hubItem, string message)
        where T : notnull
    {
        if (hubItem is not null)
            return hubItem;
        Log.Logger.Error("{Message}", message);
        throw new HubException(message);
    }

    public static Guid GetGuidUserId(this HubCallerContext context)
    {
        var user = ThrowHubExceptionIfNull(context.User, "User is not authenticated");
        return user.TryGetGuidUserId(new HubException("User is not authenticated"));
    }

    public static HubAppUser ToHubAppUser(this HubCallerContext context)
    {
        var userId = context.GetGuidUserId();
        return HubAppUser.Create(userId, context.ConnectionId);
    }

    public static AuthUser ToAuthUser(this HubCallerContext context)
    {
        var userId = context.GetGuidUserId();
        return AuthUser.Create(userId, true, context.ConnectionId);
    }

    public static T ThrowHubExceptionIfNull<T>([NotNull] T? projectItem, string message)
    {
        if (projectItem is not null)
            return projectItem;
        Log.Logger.Error("{Message}", message);
        throw new HubException(message);
    }

    public static void ThrowHubException<T>(string message)
    {
        Log.Logger.Error("{Message}", message);
        throw new HubException(message);
    }

    public static async Task<T> ThrowHubExceptionIfNullSingleOrDefaultAsync<T>(
        this IQueryable<T> query,
        Expression<Func<T, bool>> predicate,
        string message
    )
    {
        var result = await query.SingleOrDefaultAsync(predicate);

        ThrowHubExceptionIfNull(result, message);
        // [NotNull]
        return result;
    }

    public static List<T> ThrowHubExceptionIfNullToListAsync<T>(
        this IQueryable<T> query,
        string message
    )
    {
        var result = query.ToListAsync().Result;

        ThrowHubExceptionIfNull(result, message);
        return result;
    }
}