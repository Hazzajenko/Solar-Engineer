using ApplicationCore.Extensions;
using FluentValidation;
using Infrastructure.Extensions;
using Infrastructure.Mapping;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Projects.Application.Data.UnitOfWork;
using Projects.Contracts.Responses.Projects;
using Projects.Domain.Entities;
using Projects.SignalR.Commands.Projects;
using Projects.SignalR.Hubs;

namespace Projects.Application.Handlers.Projects;

public class DeleteProjectHandler : ICommandHandler<DeleteProjectCommand, bool>
{
    private readonly IHubContext<ProjectsHub, IProjectsHub> _hubContext;
    private readonly ILogger<DeleteProjectHandler> _logger;
    private readonly IProjectsUnitOfWork _unitOfWork;

    public DeleteProjectHandler(
        ILogger<DeleteProjectHandler> logger,
        IProjectsUnitOfWork unitOfWork,
        IHubContext<ProjectsHub, IProjectsHub> hubContext
    )
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
        _hubContext = hubContext;
    }

    public async ValueTask<bool> Handle(DeleteProjectCommand command, CancellationToken cT)
    {
        var appUserId = command.User.Id;
        var projectId = command.DeleteProjectRequest.ProjectId.ToGuid();
        var appUserProject =
            await _unitOfWork.AppUserProjectsRepository.GetByAppUserIdAndProjectIdAsync(
                appUserId,
                projectId
            );
        if (appUserProject is null)
        {
            _logger.LogError(
                "User {User} tried to delete project {Project} without being a member",
                appUserId,
                projectId
            );
            var message = "You are not a member of this project";
            throw new ValidationException(message, message.ToValidationFailure<AppUserProject>());
        }

        if (appUserProject.CanDelete is false)
        {
            _logger.LogError(
                "User {User} tried to delete project {Project} without having delete permissions",
                appUserId,
                projectId
            );
            var message = "You do not have delete permissions in this project";
            throw new ValidationException(message, message.ToValidationFailure<AppUserProject>());
        }

        var project = await _unitOfWork.ProjectsRepository.GetByIdAsync(projectId);
        if (project is null)
        {
            _logger.LogError(
                "User {User} tried to delete project {Project} without project existing",
                appUserId,
                projectId
            );
            var message = "Project doesnt exist";
            throw new ValidationException(message, message.ToValidationFailure<AppUserProject>());
        }

        var projectMembers =
            await _unitOfWork.AppUserProjectsRepository.GetProjectMemberIdsByProjectId(projectId);

        await _unitOfWork.ProjectsRepository.DeleteAsync(projectId);
        await _unitOfWork.SaveChangesAsync();

        var response = new ProjectDeletedResponse { ProjectId = projectId.ToString() };

        await _hubContext.Clients.Users(projectMembers).ProjectDeleted(response);
        _logger.LogInformation("User {User} deleted project {Project}", appUserId, projectId);

        return true;
    }
}