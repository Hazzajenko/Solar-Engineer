using System.Security.Claims;
using System.Security.Principal;
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
        IIdentity? identity = httpContext.User.Identity;
        if (identity is null || !identity.IsAuthenticated)
        {
            await _next(httpContext);
            return;
        }

        var userId = httpContext.User.TryParseGuidUserId();
        if (userId is null)
        {
            logger.LogInformation("LastActiveMiddleware: User is not authenticated");
            await _next(httpContext);
            return;
        }

        AppUser? appUser = await unitOfWork.AppUsersRepository.GetByIdAsync((Guid)userId);
        if (appUser is null)
        {
            logger.LogInformation("LastActiveMiddleware: User is not authenticated");
            await _next(httpContext);
            return;
        }

        appUser.LastActiveTime = DateTime.UtcNow;
        await unitOfWork.SaveChangesAsync();

        if (connectionsService.IsUserOnline(appUser.Id))
        {
            connectionsService.UpdateLastActiveTime(appUser.Id);
        }

        using (
            logger.BeginScope(
                new Dictionary<string, object>
                {
                    ["UserId"] = appUser.Id,
                    ["UserName"] = appUser.UserName
                }
            )
        )
        {
            await _next(httpContext);
        }
    }
}

public static class LastActiveMiddlewareExtensions
{
    public static IApplicationBuilder UseLastActiveMiddleware(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<LastActiveMiddleware>();
    }
}
