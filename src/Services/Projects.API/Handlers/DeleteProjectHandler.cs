using System.Security.Claims;
using FluentValidation;
using Infrastructure.Extensions;
using Infrastructure.Mapping;
using Mediator;
using Projects.API.Contracts.Requests;
using Projects.API.Data;
using Projects.API.Entities;

namespace Projects.API.Handlers;

public sealed record DeleteProjectCommand(
    ClaimsPrincipal User,
    DeleteProjectRequest DeleteProjectRequest
) : IRequest<bool>;

public class DeleteProjectHandler : IRequestHandler<DeleteProjectCommand, bool>
{
    private readonly ILogger<DeleteProjectHandler> _logger;
    private readonly IProjectsUnitOfWork _unitOfWork;

    public DeleteProjectHandler(ILogger<DeleteProjectHandler> logger, IProjectsUnitOfWork unitOfWork)
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
    }

    public async ValueTask<bool> Handle(DeleteProjectCommand request, CancellationToken cT)
    {
        var appUserId = request.User.GetGuidUserId();
        var projectId = request.DeleteProjectRequest.Id.ToGuid();
        var appUserProject = await _unitOfWork.AppUserProjectsRepository.GetByAppUserAndProjectIdAsync(
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

        await _unitOfWork.ProjectsRepository.DeleteAsync(projectId);

        await _unitOfWork.SaveChangesAsync();
        // var project = request.DeleteProjectRequest.ToDomain(appUserId);
        // await _unitOfWork.ProjectsRepository.AddAsync(project);

        return true;
    }
}