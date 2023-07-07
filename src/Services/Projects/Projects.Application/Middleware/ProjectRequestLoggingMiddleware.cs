using System.Security.Principal;
using ApplicationCore.Extensions;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Projects.Application.Data.UnitOfWork;
using Projects.Domain.Entities;

namespace Projects.Application.Middleware;

public class ProjectRequestLoggingMiddleware
{
    private readonly RequestDelegate _next;

    public ProjectRequestLoggingMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(
        HttpContext httpContext,
        ILogger<ProjectRequestLoggingMiddleware> logger,
        IProjectsUnitOfWork unitOfWork
    )
    {
        IIdentity? identity = httpContext.User.Identity;
        if (identity is null || !identity.IsAuthenticated)
        {
            await _next(httpContext);
            return;
        }

        var authUser = httpContext.User.ToAuthUser();

        ProjectUser? projectUser = await unitOfWork.ProjectUsersRepository.GetByIdAsync(
            authUser.Id
        );
        if (projectUser is null)
        {
            logger.LogError("User {UserName}: Project user not found", authUser.UserName);
            await _next(httpContext);
            return;
        }

        using (
            logger.BeginScope(
                new Dictionary<string, object>
                {
                    ["UserId"] = authUser.Id,
                    ["UserName"] = authUser.UserName,
                    ["SelectedProjectId"] = projectUser.SelectedProjectId.ToString() ?? "null"
                }
            )
        )
        {
            await _next(httpContext);
        }
    }
}
