using ApplicationCore.Extensions;
using ApplicationCore.Interfaces;
using Infrastructure.OpenTelemetry;
using Microsoft.ApplicationInsights;
using Microsoft.ApplicationInsights.DataContracts;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.DependencyInjection;
using Projects.Application.Data.UnitOfWork;
using Projects.Domain.Common;
using Projects.Domain.Entities;
using Projects.SignalR.Hubs;

namespace Projects.Application.HubFilters;

public class ProjectsHubFilter : IHubFilter
{
    public async ValueTask<object?> InvokeMethodAsync(
        HubInvocationContext invocationContext,
        Func<HubInvocationContext, ValueTask<object?>> next
    )
    {
        var logger = invocationContext.ServiceProvider.GetService<ILogger<ProjectsHubFilter>>()!;
        var authUser = invocationContext.Context.ToAuthUser();
        if (invocationContext.HubMethodName != nameof(ProjectsHub.SendProjectEvent))
        {
            logger.LogInformation(
                "User {UserName}: Calling hub method {HubMethodName}",
                authUser.UserName,
                invocationContext.HubMethodName
            );
        }
        var unitOfWork = invocationContext.ServiceProvider.GetService<IProjectsUnitOfWork>()!;
        ProjectUser? projectUser = await unitOfWork.ProjectUsersRepository.GetByIdAsync(
            authUser.Id
        );
        if (projectUser is null)
        {
            logger.LogError("User {UserName}: ProjectUser is null", authUser.UserName);
            return await HandleNextNoProject(invocationContext, next, authUser, "null", logger);
        }

        var telemetryClient = invocationContext.ServiceProvider.GetService<TelemetryClient>();
        if (telemetryClient is null)
        {
            logger.LogError("TelemetryClient is null");
            return await HandleNextNoProject(invocationContext, next, authUser, "null", logger);
        }

        var selectedProjectId = projectUser.SelectedProjectId.ToString() ?? "null";

        var hubMethodArguments = invocationContext.HubMethodArguments;
        if (hubMethodArguments.Any() is false)
            return await HandleNextNoProject(
                invocationContext,
                next,
                authUser,
                selectedProjectId,
                logger,
                telemetryClient
            );

        object? argument = invocationContext.HubMethodArguments[0];
        if (argument is not IProjectRequest projectRequest)
            return await HandleNextNoProject(
                invocationContext,
                next,
                authUser,
                selectedProjectId,
                logger,
                telemetryClient
            );
        var projectId = projectRequest.ProjectId;

        var state = new Dictionary<string, object>
        {
            ["UserId"] = authUser.Id,
            ["UserName"] = authUser.UserName,
            ["IsAuthenticated"] = true,
            ["ConnectionId"] = invocationContext.Context.ConnectionId,
            ["HubMethodName"] = invocationContext.HubMethodName,
            ["ProjectId"] = projectId,
            ["SelectedProjectId"] = projectUser.SelectedProjectId.ToString() ?? "null"
        };
        RequestTelemetry? requestTelemetry = telemetryClient?.GetRequestTelemetry(
            authUser,
            state.ToStringDictionary()
        );
        using var operation = telemetryClient.StartOperation(requestTelemetry);
        using IDisposable? scope = logger.BeginScope(state);

        return await next(invocationContext);
    }

    private static async ValueTask<object?> HandleNextNoProject(
        HubInvocationContext invocationContext,
        Func<HubInvocationContext, ValueTask<object?>> next,
        IUser authUser,
        string selectedProjectId,
        ILogger logger,
        TelemetryClient? telemetryClient = null
    )
    {
        var state = new Dictionary<string, string>
        {
            ["UserId"] = authUser.Id.ToString(),
            ["UserName"] = authUser.UserName,
            ["IsAuthenticated"] = true.ToString(),
            ["ConnectionId"] = invocationContext.Context.ConnectionId,
            ["HubMethodName"] = invocationContext.HubMethodName,
            ["SelectedProjectId"] = selectedProjectId
        };
        RequestTelemetry? requestTelemetry = telemetryClient?.GetRequestTelemetry(authUser, state);
        using var operation = telemetryClient.StartOperation(requestTelemetry);
        using IDisposable? scope = logger.BeginScope(state);

        return await next(invocationContext);
    }
}
