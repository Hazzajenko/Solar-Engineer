using FluentValidation;
using Infrastructure.Extensions;
using Infrastructure.Mapping;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Projects.API.Contracts.Responses.Projects;
using Projects.API.Data;
using Projects.API.Entities;
using Projects.API.Hubs;
using Projects.API.Mapping;

namespace Projects.API.Handlers.Projects.InviteToProject;

public class InviteToProjectHandler : ICommandHandler<InviteToProjectCommand, bool>
{
    private readonly IHubContext<ProjectsHub, IProjectsHub> _hubContext;
    private readonly ILogger _logger;
    private readonly IProjectsUnitOfWork _unitOfWork;

    public InviteToProjectHandler(
        ILogger<InviteToProjectHandler> logger,
        IProjectsUnitOfWork unitOfWork,
        IHubContext<ProjectsHub, IProjectsHub> hubContext
    )
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
        _hubContext = hubContext;
    }

    public async ValueTask<bool> Handle(InviteToProjectCommand command, CancellationToken cT)
    {
        var appUserId = command.User.Id;
        var projectIdGuid = command.Request.ProjectId.ToGuid();
        var project = await _unitOfWork.ProjectsRepository.GetByIdAsync(projectIdGuid);
        if (project is null)
        {
            _logger.LogError(
                "User {User} tried to invite to project {Project} that does not exist",
                appUserId,
                projectIdGuid
            );
            var message = $"Project {projectIdGuid} does not exist";
            throw new ValidationException(message, message.ToValidationFailure<Project>());
        }

        var appUserProject =
            await _unitOfWork.AppUserProjectsRepository.GetByAppUserIdAndProjectIdAsync(
                appUserId,
                projectIdGuid
            );
        if (appUserProject is null)
        {
            _logger.LogError(
                "User {User} tried to invite to project {Project} without a App User Project Link",
                appUserId,
                projectIdGuid
            );
            var message = $"User {appUserId} is not apart of project {projectIdGuid}";
            throw new ValidationException(message, message.ToValidationFailure<AppUserProject>());
        }

        if (appUserProject.CanInvite is false)
            // TODO: Add a better error message
            throw new ValidationException("User cannot invite to project");

        foreach (var requestInvite in command.Request.Invites)
        {
            var existingAppUserProject =
                await _unitOfWork.AppUserProjectsRepository.GetByAppUserIdAndProjectIdAsync(
                    requestInvite.UserId.ToGuid(),
                    projectIdGuid
                );

            if (existingAppUserProject is not null)
            {
                _logger.LogError(
                    "User {User} tried to invite user {Invitee} to project {Project} but they are already apart of the project",
                    appUserId,
                    requestInvite.UserId,
                    projectIdGuid
                );
                var message =
                    $"User {requestInvite.UserId} is already apart of project {projectIdGuid}";
                throw new ValidationException(
                    message,
                    message.ToValidationFailure<AppUserProject>()
                );
            }

            var requestAppUserProject = AppUserProject.Create(
                projectIdGuid,
                appUserId,
                requestInvite.Role
            );

            await _unitOfWork.AppUserProjectsRepository.AddAsync(requestAppUserProject);
        }

        var userIds = command.Request.Invites.Select(x => x.UserId).ToList();
        var projectMembers =
            await _unitOfWork.AppUserProjectsRepository.GetProjectMemberIdsByProjectId(
                projectIdGuid
            );

        await _unitOfWork.SaveChangesAsync();

        var newProjectMembers = new InviteToProjectResponse
        {
            ProjectId = command.Request.ProjectId,
            InvitedUserIds = userIds
        };

        var response = project.ToDto();

        await _hubContext.Clients.Users(userIds).InvitedToProject(response);
        await _hubContext.Clients.Users(projectMembers).NewProjectMembers(newProjectMembers);
        _logger.LogInformation(
            "User {User} invited users {Users} to project {Project}",
            appUserId,
            userIds,
            project.Name
        );

        return true;
    }
}