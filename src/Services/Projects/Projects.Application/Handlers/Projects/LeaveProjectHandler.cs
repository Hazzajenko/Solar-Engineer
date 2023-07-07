using ApplicationCore.Extensions;
using FluentValidation;
using Infrastructure.Extensions;
using Infrastructure.Mapping;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Projects.Application.Data.UnitOfWork;
using Projects.Application.Extensions;
using Projects.Contracts.Responses.Projects;
using Projects.Domain.Entities;
using Projects.SignalR.Commands.Projects;
using Projects.SignalR.Hubs;

namespace Projects.Application.Handlers.Projects;

public class LeaveProjectHandler : ICommandHandler<LeaveProjectCommand, bool>
{
    private readonly IHubContext<ProjectsHub, IProjectsHub> _hubContext;
    private readonly ILogger<LeaveProjectHandler> _logger;
    private readonly IProjectsUnitOfWork _unitOfWork;

    public LeaveProjectHandler(
        ILogger<LeaveProjectHandler> logger,
        IProjectsUnitOfWork unitOfWork,
        IHubContext<ProjectsHub, IProjectsHub> hubContext
    )
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
        _hubContext = hubContext;
    }

    public async ValueTask<bool> Handle(LeaveProjectCommand command, CancellationToken cT)
    {
        Guid appUserId = command.User.Id;
        var projectId = command.LeaveProjectRequest.ProjectId.ToGuid();
        AppUserProject? appUserProject =
            await _unitOfWork.AppUserProjectsRepository.GetByAppUserIdAndProjectIdAsync(
                appUserId,
                projectId
            );
        if (appUserProject is null)
        {
            _logger.LogError(
                "User {UserName}: Tried to delete Project {Project} without being a member",
                command.User.UserName,
                projectId
            );
            const string message = "You are not a member of this project";
            throw new ValidationException(message, message.ToValidationFailure<AppUserProject>());
        }

        Project project = appUserProject.Project;

        var projectMembers =
            await _unitOfWork.AppUserProjectsRepository.GetProjectMemberIdsByProjectId(projectId);

        if (projectMembers.Count() == 1)
        {
            await _unitOfWork.ProjectsRepository.ExecuteDeleteAsync(x => x.Id == projectId);
            await _unitOfWork.SaveChangesAsync();
            var projectDeletedResponse = new ProjectDeletedResponse
            {
                ProjectId = projectId.ToString()
            };
            await _hubContext.Clients
                .Users(appUserId.ToString())
                .ProjectDeleted(projectDeletedResponse);
            _logger.LogInformation(
                "User {UserName}: Deleted Project {ProjectName}",
                command.User.UserName,
                project.Name
            );
            return true;
        }

        await _unitOfWork.AppUserProjectsRepository.ExecuteDeleteAsync(
            x => x.AppUserId == appUserId && x.ProjectId == projectId
        );
        await _unitOfWork.SaveChangesAsync();

        var leaveProjectResponse = new LeftProjectResponse { ProjectId = projectId.ToString() };
        await _hubContext.Clients.Users(appUserId.ToString()).LeftProject(leaveProjectResponse);

        var userLeftProjectResponse = new UserLeftProjectResponse
        {
            ProjectId = projectId.ToString(),
            UserId = appUserId.ToString()
        };

        var projectMembersExceptUser = projectMembers.Where(x => x != appUserId.ToString());

        await _hubContext.Clients
            .Users(projectMembersExceptUser)
            .UserLeftProject(userLeftProjectResponse);
        _logger.LogInformation(
            "User {UserName}: Left Project {ProjectName}",
            command.User.UserName,
            project.Name
        );

        return true;
    }
}
