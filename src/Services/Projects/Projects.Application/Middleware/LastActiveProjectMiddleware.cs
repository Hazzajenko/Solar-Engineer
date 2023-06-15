/*
using Infrastructure.Extensions;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Projects.Application.Data.UnitOfWork;

namespace Projects.Application.Middleware;

public class LastActiveProjectMiddleware
{
    private readonly RequestDelegate _next;

    public LastActiveProjectMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(
        HttpContext httpContext,
        ILogger<LastActiveProjectMiddleware> logger,
        IProjectsUnitOfWork unitOfWork,
        IHttpContextAccessor httpContextAccessor
    )
    {
        logger.LogInformation("LastActiveMiddleware invoked");
        if (httpContext.User.Identity is null)
        {
            logger.LogInformation("User is not authenticated");
            await _next(httpContext);
        }
        if (httpContext.User.Identity!.IsAuthenticated)
        {
            Guid? userId = httpContext.User.TryParseGuidUserId();
            if (userId is null)
            {
                logger.LogInformation("User is not authenticated");
                await _next(httpContext);
                return;
            }
            // httpContextAccessor.HttpContext.

            var user = await unitOfWork.AppUsersRepository.GetByIdAsync((Guid)userId);
            if (user != null)
            {
                user.LastActiveTime = DateTime.UtcNow;
                await unitOfWork.SaveChangesAsync();
            }
        }

        await _next(httpContext);
    }
}

public static class LastActiveMiddlewareExtensions
{
    public static IApplicationBuilder UseLastActiveMiddleware(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<LastActiveProjectMiddleware>();
    }
}
*/
