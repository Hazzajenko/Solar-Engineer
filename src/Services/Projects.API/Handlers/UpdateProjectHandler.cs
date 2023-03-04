using System.Security.Claims;
using FluentValidation;
using Infrastructure.Extensions;
using Infrastructure.Mapping;
using Mediator;
using Projects.API.Contracts.Requests.Projects;
using Projects.API.Data;
using Projects.API.Entities;

namespace Projects.API.Handlers;

public sealed record UpdateProjectCommand(
    ClaimsPrincipal User,
    UpdateProjectRequest UpdateProjectRequest
) : IRequest<bool>;

public class UpdateProjectHandler : IRequestHandler<UpdateProjectCommand, bool>
{
    private readonly ILogger<UpdateProjectHandler> _logger;
    private readonly IProjectsUnitOfWork _unitOfWork;

    public UpdateProjectHandler(ILogger<UpdateProjectHandler> logger, IProjectsUnitOfWork unitOfWork)
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
    }

    public async ValueTask<bool> Handle(UpdateProjectCommand request, CancellationToken cT)
    {
        var appUserId = request.User.GetGuidUserId();
        var projectId = request.UpdateProjectRequest.ProjectId.ToGuid();
        var appUserProject = await _unitOfWork.AppUserProjectsRepository.GetByAppUserIdAndProjectIdAsync(
            appUserId,
            projectId
        );
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

        if (request.UpdateProjectRequest.Changes.Name is not null)
            appUserProject.Project.Name = request.UpdateProjectRequest.Changes.Name;

        await _unitOfWork.SaveChangesAsync();
        // var project = request.CreateProjectRequest.ToDomain(appUserId);
        // await _unitOfWork.ProjectsRepository.AddAsync(appUserProject);

        return true;
    }
}