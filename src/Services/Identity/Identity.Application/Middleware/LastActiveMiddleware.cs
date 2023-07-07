using System.Security.Claims;
using ApplicationCore.Extensions;
using Identity.Application.Data.UnitOfWork;
using Identity.Application.Services.Connections;
using Identity.Domain;
using Infrastructure.Extensions;
using JasperFx.CodeGeneration.Frames;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Serilog;

namespace Identity.Application.Middleware;

public class LastActiveMiddleware
{
    private readonly RequestDelegate _next;

    public LastActiveMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(
        HttpContext httpContext,
        ILogger<LastActiveMiddleware> logger,
        IIdentityUnitOfWork unitOfWork,
        IHttpContextAccessor httpContextAccessor,
        IConnectionsService connectionsService
    )
    {
        if (httpContext.User.Identity is null)
        {
            logger.LogInformation("LastActiveMiddleware: User is not authenticated");
            await _next(httpContext);
            return;
        }
        if (httpContext.User.Identity!.IsAuthenticated)
        {
            var userId = httpContext.User.TryParseGuidUserId();
            if (userId is null)
            {
                logger.LogInformation("LastActiveMiddleware: User is not authenticated");
                await _next(httpContext);
                return;
            }

            AppUser? appUser = await unitOfWork.AppUsersRepository.GetByIdAsync((Guid)userId);
            if (appUser is not null)
            {
                appUser.LastActiveTime = DateTime.UtcNow;
                await unitOfWork.SaveChangesAsync();

                if (connectionsService.IsUserOnline(appUser.Id))
                {
                    connectionsService.UpdateLastActiveTime(appUser.Id);
                }

                var endpoint = httpContext.GetEndpoint();
                Log.Logger.Information(
                    "LastActiveMiddleware: {EndpointDisplayName} - {EndpointRoutePattern}",
                    endpoint?.DisplayName,
                    endpoint?.DisplayName
                );

                using (
                    logger.BeginScope(
                        new Dictionary<string, object>
                        {
                            ["UserId"] = appUser.Id,
                            ["UserName"] = appUser.UserName,
                            ["DisplayName"] = appUser.DisplayName,
                            ["IsOnline"] = connectionsService.IsUserOnline(appUser.Id)
                        }
                    )
                )
                {
                    await _next(httpContext);
                    return;
                }
            }
        }

        await _next(httpContext);
    }
}

public static class LastActiveMiddlewareExtensions
{
    public static IApplicationBuilder UseLastActiveMiddleware(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<LastActiveMiddleware>();
    }
}
