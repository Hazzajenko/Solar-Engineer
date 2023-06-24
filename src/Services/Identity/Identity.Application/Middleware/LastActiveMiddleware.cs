using System.Security.Claims;
using ApplicationCore.Extensions;
using Identity.Application.Data.UnitOfWork;
using Infrastructure.Extensions;
using JasperFx.CodeGeneration.Frames;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

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
        return builder.UseMiddleware<LastActiveMiddleware>();
    }
}
