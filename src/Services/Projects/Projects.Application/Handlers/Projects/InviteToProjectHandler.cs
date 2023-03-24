using EventBus.Domain.ProjectsEvents;
using FluentValidation;
using Infrastructure.Extensions;
using Infrastructure.Logging;
using Infrastructure.Mapping;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Projects.Application.Data;
using Projects.Application.Mapping;
using Projects.Domain.Commands.Projects;
using Projects.Domain.Contracts.Responses.Projects;
using Projects.Domain.Entities;
using Projects.SignalR.Hubs;
using Wolverine;

namespace Projects.Application.Handlers.Projects;

public class InviteToProjectHandler
    : ICommandHandler<InviteToProjectCommand, InviteToProjectResponse?>
{
    private readonly IMessageBus _bus;
    private readonly IHubContext<ProjectsHub, IProjectsHub> _hubContext;
    private readonly ILogger _logger;
    private readonly IProjectsUnitOfWork _unitOfWork;

    public InviteToProjectHandler(
        ILogger<InviteToProjectHandler> logger,
        IProjectsUnitOfWork unitOfWork,
        IHubContext<ProjectsHub, IProjectsHub> hubContext,
        IMessageBus bus
    )
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
        _hubContext = hubContext;
        _bus = bus;
    }

    public async ValueTask<InviteToProjectResponse?> Handle(
        InviteToProjectCommand command,
        CancellationToken cT
    )
    {
        var appUserId = command.User.Id;
        var projectIdGuid = command.Request.ProjectId.ToGuid();
        /*var project = await _unitOfWork.ProjectsRepository.GetByIdAsync(projectIdGuid);
        if (project is null)
        {
            _logger.LogError(
                "User {User} tried to invite to project {Project} that does not exist",
                appUserId,
                projectIdGuid
            );
            var message = $"Project {projectIdGuid} does not exist";
            throw new ValidationException(message, message.ToValidationFailure<Project>());
        }*/

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

            return null;
            // return new ErrorOr.ErrorOr<InviteToProjectResponse?>(null);
            // var message = $"User {appUserId} is not apart of project {projectIdGuid}";
            // throw new ValidationException(message, message.ToValidationFailure<AppUserProject>());
        }

        if (appUserProject.CanInvite is false)
        {
            _logger.LogError(
                "User {User} tried to invite to project {Project} but they do not have permission",
                appUserId,
                projectIdGuid
            );
            // TODO: Add a better error message
            throw new ValidationException("User does not have invite permissions in this project");
        }

        foreach (var requestInvite in command.Request.Invites)
        {
            var invitedUserGuidId = requestInvite.UserId.ToGuid();
            var existingAppUserProject =
                await _unitOfWork.AppUserProjectsRepository.GetByAppUserIdAndProjectIdAsync(
                    invitedUserGuidId,
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
                invitedUserGuidId,
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
            InvitedByUserId = appUserId.ToString(),
            InvitedUserIds = userIds
        };

        var response = appUserProject.Project.ToDto();

        await _hubContext.Clients.Users(userIds).InvitedToProject(response);
        await _hubContext.Clients.Users(projectMembers).NewProjectMembers(newProjectMembers);

        _logger.LogInformation(
            "User {User} invited users {Users} to project {Project}",
            appUserId,
            userIds,
            appUserProject.Project.Name
        );

        var projectEvent = new ProjectEvent(projectIdGuid, ProjectEventType.Invited, userIds);
        projectEvent.DumpObjectJson();
        await _bus.SendAsync(projectEvent);
        // return

        // await _unitOfWork.ProjectEventsRepository.AddAsync(projectEvent);


        return newProjectMembers;
    }
}