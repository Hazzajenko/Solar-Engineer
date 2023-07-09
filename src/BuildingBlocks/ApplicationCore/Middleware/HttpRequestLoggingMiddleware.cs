using System.Security.Principal;
using System.Globalization;
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
        if (httpContext.Request.Path.StartsWithSegments("/health"))
        {
            await _next(httpContext);
            return;
        }

        if (httpContext.Request.Path.StartsWithSegments("/metrics"))
        {
            await _next(httpContext);
            return;
        }
        IIdentity? identity = httpContext.User.Identity;
        if (identity is null || !identity.IsAuthenticated)
        {
            logger.LogInformation(
                "UnAuthenticated request: {RequestPath}",
                httpContext.Request.Path
            );
            using (
                logger.BeginScope(new Dictionary<string, object> { ["IsAuthenticated"] = false })
            )
                await _next(httpContext);
            return;
        }

        if (
            httpContext.Request.Path.StartsWithSegments("/authorize")
            && httpContext.Request.Method == "POST"
        )
        {
            await _next(httpContext);
            return;
        }

        var authUser = httpContext.User.ToAuthUser();

        logger.LogInformation(
            "User {UserName}: Executing endpoint {EndPoint}",
            authUser.UserName,
            httpContext.Request.Path
        );
        using IDisposable? scope = logger.BeginScope(
            new Dictionary<string, object>
            {
                ["UserId"] = authUser.Id,
                ["UserName"] = authUser.UserName,
                ["IsAuthenticated"] = true
            }
        );

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
