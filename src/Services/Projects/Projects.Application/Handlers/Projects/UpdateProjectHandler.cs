using ApplicationCore.Extensions;
using FluentValidation;
using Infrastructure.Extensions;
using Infrastructure.Mapping;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Projects.Application.Data.UnitOfWork;
using Projects.Contracts.Requests.Projects;
using Projects.Contracts.Responses.Projects;
using Projects.Domain.Entities;
using Projects.SignalR.Commands.Projects;
using Projects.SignalR.Hubs;

namespace Projects.Application.Handlers.Projects;

public class UpdateProjectHandler : ICommandHandler<UpdateProjectCommand, bool>
{
    private readonly IHubContext<ProjectsHub, IProjectsHub> _hubContext;
    private readonly ILogger<UpdateProjectHandler> _logger;
    private readonly IProjectsUnitOfWork _unitOfWork;

    public UpdateProjectHandler(
        ILogger<UpdateProjectHandler> logger,
        IProjectsUnitOfWork unitOfWork,
        IHubContext<ProjectsHub, IProjectsHub> hubContext
    )
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
        _hubContext = hubContext;
    }

    public async ValueTask<bool> Handle(UpdateProjectCommand command, CancellationToken cT)
    {
        Guid appUserId = command.User.Id;
        var projectId = command.UpdateProjectRequest.ProjectId.ToGuid();
        AppUserProject? appUserProject =
            await _unitOfWork.AppUserProjectsRepository.GetByAppUserIdAndProjectIdAsync(
                appUserId,
                projectId
            );
        ProjectChanges projectChanges = command.UpdateProjectRequest.Changes;
        if (appUserProject is null)
        {
            _logger.LogError(
                "User {UserName}: Tried to update Project {ProjectId} without a App User Project",
                command.User.UserName,
                projectId
            );
            const string message = "You are not a member of this project";
            throw new ValidationException(message, message.ToValidationFailure<AppUserProject>());
        }

        if (projectChanges.Name is not null)
            appUserProject.Project.Name = projectChanges.Name;

        if (projectChanges.Colour is not null)
            appUserProject.Project.Colour = projectChanges.Colour;

        await _unitOfWork.ProjectsRepository.UpdateAndSaveChangesAsync(appUserProject.Project);

        await _unitOfWork.SaveChangesAsync();

        var projectMemberIds =
            await _unitOfWork.AppUserProjectsRepository.GetProjectMemberIdsByProjectId(projectId);

        var response = new ProjectUpdatedResponse
        {
            ProjectId = projectId.ToString(),
            Changes = projectChanges
        };

        await _hubContext.Clients.Users(projectMemberIds).ProjectUpdated(response);

        _logger.LogInformation(
            "User {UserName}: Updated Project {ProjectName}",
            command.User.UserName,
            appUserProject.Project.Name
        );

        return true;
    }
}
