using System.Security.Principal;
using ApplicationCore.Entities;
using ApplicationCore.Extensions;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace ApplicationCore.Middleware;

public class HttpRequestLoggingMiddleware
{
    private readonly RequestDelegate _next;

    public HttpRequestLoggingMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(
        HttpContext httpContext,
        ILogger<HttpRequestLoggingMiddleware> logger
    )
    {
        // httpContextAccessor.
        IIdentity? identity = httpContext.User.Identity;
        if (identity is null || !identity.IsAuthenticated)
        {
            logger.LogInformation(
                "UnAuthenticated Request: {RequestPath}",
                httpContext.Request.Path
            );
            using (
                logger.BeginScope(new Dictionary<string, object> { ["IsAuthenticated"] = false })
            )
                await _next(httpContext);
            return;
        }

        var authUser = httpContext.User.ToAuthUser();
        if (authUser.UserName is null)
        {
            logger.LogError("User {UserId} has no username", authUser.Id);
        }

        logger.LogInformation(
            "User {UserName} - ({UserId}): executing endpoint {EndPoint}",
            authUser.UserName,
            authUser.Id,
            httpContext.Request.Path
        );
        using (
            logger.BeginScope(
                new Dictionary<string, object>
                {
                    ["UserId"] = authUser.Id,
                    ["UserName"] = authUser.UserName,
                    ["IsAuthenticated"] = true
                }
            )
        )
            await _next(httpContext);
    }
}

public static class HttpRequestLoggingMiddlewareExtensions
{
    public static IApplicationBuilder UseHttpRequestLoggingMiddleware(
        this IApplicationBuilder builder
    )
    {
        return builder.UseMiddleware<HttpRequestLoggingMiddleware>();
    }
}
