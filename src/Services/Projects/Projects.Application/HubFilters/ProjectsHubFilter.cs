using ApplicationCore.Entities;
using Infrastructure.Logging;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.DependencyInjection;
using Projects.Application.Data.UnitOfWork;
using Projects.Domain.Common;
using Projects.Domain.Entities;
using Serilog;
using ILogger = Microsoft.Extensions.Logging.ILogger;

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
        logger.LogInformation(
            "User {UserName}: Calling hub method {HubMethodName}",
            authUser.UserName,
            invocationContext.HubMethodName
        );
        var unitOfWork = invocationContext.ServiceProvider.GetService<IProjectsUnitOfWork>()!;
        ProjectUser? projectUser = await unitOfWork.ProjectUsersRepository.GetByIdAsync(
            authUser.Id
        );
        if (projectUser is null)
        {
            logger.LogError("User {UserName}: ProjectUser is null", authUser.UserName);
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
                logger
            );

        object? argument = invocationContext.HubMethodArguments[0];
        if (argument is not IProjectRequest projectRequest)
            return await HandleNextNoProject(
                invocationContext,
                next,
                authUser,
                selectedProjectId,
                logger
            );
        var projectId = projectRequest.ProjectId;

        using (
            logger.BeginScope(
                new Dictionary<string, object>
                {
                    ["UserId"] = authUser.Id,
                    ["UserName"] = authUser.UserName,
                    ["ConnectionId"] = invocationContext.Context.ConnectionId,
                    ["HubMethodName"] = invocationContext.HubMethodName,
                    ["ProjectId"] = projectId,
                    ["SelectedProjectId"] = projectUser.SelectedProjectId.ToString() ?? "null"
                }
            )
        )
        {
            return await next(invocationContext);
        }
    }

    private async ValueTask<object?> HandleNextNoProject(
        HubInvocationContext invocationContext,
        Func<HubInvocationContext, ValueTask<object?>> next,
        AuthUser authUser,
        string selectedProjectId,
        ILogger logger
    )
    {
        using (
            logger.BeginScope(
                new Dictionary<string, object>
                {
                    ["UserId"] = authUser.Id,
                    ["UserName"] = authUser.UserName,
                    ["ConnectionId"] = invocationContext.Context.ConnectionId,
                    ["HubMethodName"] = invocationContext.HubMethodName,
                    ["SelectedProjectId"] = selectedProjectId
                }
            )
        )
        {
            return await next(invocationContext);
        }
    }
}
