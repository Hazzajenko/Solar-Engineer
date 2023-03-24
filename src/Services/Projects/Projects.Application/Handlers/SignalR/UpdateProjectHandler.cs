using FluentValidation;
using Infrastructure.Extensions;
using Infrastructure.Mapping;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Projects.Application.Data;
using Projects.Domain.Contracts.Requests.Projects;
using Projects.Domain.Entities;
using Projects.SignalR.Hubs;

namespace Projects.Application.Handlers.SignalR;

public sealed record UpdateProjectCommand(
    HubCallerContext Context,
    UpdateProjectRequest UpdateProjectRequest
) : IRequest<bool>;

public class UpdateProjectHandler : IRequestHandler<UpdateProjectCommand, bool>
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

    public async ValueTask<bool> Handle(UpdateProjectCommand request, CancellationToken cT)
    {
        ArgumentNullException.ThrowIfNull(request.Context.User);
        var appUserId = request.Context.User.GetGuidUserId();
        var projectId = request.UpdateProjectRequest.ProjectId.ToGuid();
        var appUserProject =
            await _unitOfWork.AppUserProjectsRepository.GetByAppUserIdAndProjectIdAsync(
                appUserId,
                projectId
            );
        var projectChanges = request.UpdateProjectRequest.Changes;
        if (appUserProject is null)
        {
            _logger.LogError(
                "User {User} tried to update project {Project} without a App User Project Link",
                appUserId,
                projectId
            );
            var message = $"User {appUserId} is not apart of project {projectId}";
            throw new ValidationException(message, message.ToValidationFailure<AppUserProject>());
        }

        if (projectChanges.Name is not null)
            appUserProject.Project.Name = projectChanges.Name;

        await _unitOfWork.SaveChangesAsync();

        var projectMemberIds =
            await _unitOfWork.AppUserProjectsRepository.GetProjectMemberIdsByProjectId(projectId);

        await _hubContext.Clients.Users(projectMemberIds).UpdateProject(projectChanges);

        _logger.LogInformation(
            "User {User} updated {Project}",
            appUserId.ToString(),
            projectId.ToString()
        );

        return true;
    }
}