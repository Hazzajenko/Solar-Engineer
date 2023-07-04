using System.Diagnostics;
using System.Diagnostics.CodeAnalysis;
using System.Linq.Expressions;
using System.Security.Claims;
using System.Text.Json.Serialization;
using ApplicationCore.Entities;
using ApplicationCore.Exceptions;
using ApplicationCore.Extensions;
using Infrastructure.Extensions;
using Infrastructure.SignalR.HubFilters;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Serilog;

namespace Infrastructure.SignalR;

public static class SignalRExtensions
{
    public static IServiceCollection ConfigureSignalRWithRedis(
        this IServiceCollection services,
        IWebHostEnvironment env,
        Action<JsonHubProtocolOptions>? configureJsonProtocol = null,
        List<JsonConverter>? jsonConverters = default!
    )
    {
        var redisConnectionString = env.IsDevelopment() ? "localhost" : "redis";
        services
            .AddSignalR(options =>
            {
                options.DisableImplicitFromServicesParameters = true;
                if (env.IsDevelopment())
                    options.EnableDetailedErrors = true;

                options.AddFilter<HubLoggerFilter>();
            })
            .AddJsonProtocol(options =>
            {
                configureJsonProtocol?.Invoke(options);
                if (jsonConverters is not null)
                {
                    foreach (var jsonConverter in jsonConverters)
                    {
                        options.PayloadSerializerOptions.Converters.Add(jsonConverter);
                    }
                }
            })
            .AddStackExchangeRedis(redisConnectionString);

        // ISignalRServerBuilder builder = services
        //      .AddSignalR(options =>
        //      {
        //          options.DisableImplicitFromServicesParameters = true;
        //          if (env.IsDevelopment())
        //              options.EnableDetailedErrors = true;
        //
        //          options.AddFilter<HubLoggerFilter>();
        //      })
        //      .AddJsonProtocol(options =>
        //      {
        //          configureJsonProtocol?.Invoke(options);
        //          options.PayloadSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        //          // options.PayloadSerializerOptions.Converters.Add(new ProjectTemplateKeyConverter());
        //      })
        //      .AddStackExchangeRedis(redisConnectionString);

        return services;
    }

    public static IServiceCollection InitStackExchangeRedis(
        this ISignalRServerBuilder builder,
        IServiceCollection services,
        IWebHostEnvironment env
    )
    {
        var redisConnectionString = env.IsDevelopment() ? "localhost" : "redis";
        builder.AddStackExchangeRedis(redisConnectionString);
        return services;
    }

    public static Guid GetGuidUserId(this HubCallerContext context)
    {
        ClaimsPrincipal? user = context.User;
        if (user is null)
        {
            throw new NotAuthenticatedHubException(nameof(user));
        }
        return user.TryGetGuidUserId(new NotAuthenticatedHubException(nameof(user)));
        // return user.TryGetGuidUserId(new HubException("User is not authenticated"));
    }

    public static string GetUserName(this HubCallerContext context)
    {
        if (context.User is null)
        {
            throw new NotAuthenticatedHubException(nameof(context.User));
        }
        return context.User.GetUserName();
    }

    public static AuthUser ToAuthUser(this HubCallerContext context)
    {
        Guid userId = context.GetGuidUserId();
        var userName = context.GetUserName();
        return AuthUser.Create(userId, userName, context.ConnectionId);
    }

    public static string ToAuthUserLog(this AuthUser user)
    {
        return $"User: {user.UserName} ({user.Id})";
    }

    public static T ThrowHubExceptionIfNull<T>([NotNull] this T? item, string? message = null)
    {
        if (item is not null)
            return item;
        StackTrace stackTrace = new StackTrace();
        var previousFrame = stackTrace.GetFrame(1);
        var callingClassName = previousFrame?.GetMethod()?.DeclaringType?.Name;
        var callingMethodName = previousFrame?.GetMethod()?.Name;
        Log.Logger.Error(
            "{CallingClassName}.{CallingMethodName}: {Item} is null : {Message}",
            callingClassName,
            callingMethodName,
            nameof(T),
            message
        );
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
