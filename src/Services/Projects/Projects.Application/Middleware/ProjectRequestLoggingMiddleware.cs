using System.Security.Principal;
using ApplicationCore.Extensions;
using Infrastructure.OpenTelemetry;
using Microsoft.ApplicationInsights;
using Microsoft.ApplicationInsights.DataContracts;
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
        IProjectsUnitOfWork unitOfWork,
        TelemetryClient telemetryClient
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

        var state = new Dictionary<string, object>
        {
            ["UserId"] = authUser.Id,
            ["UserName"] = authUser.UserName,
            ["IsAuthenticated"] = true,
            ["SelectedProjectId"] = projectUser.SelectedProjectId.ToString() ?? "null"
        };
        RequestTelemetry? requestTelemetry = telemetryClient?.GetRequestTelemetry(
            authUser,
            state.ToStringDictionary()
        );
        using var operation = telemetryClient.StartOperation(requestTelemetry);
        using IDisposable? scope = logger.BeginScope(state);

        await _next(httpContext);
    }
}
