using EventBus.Domain.ProjectsEvents;
using FluentValidation;
using FluentValidation.Results;
using Infrastructure.Events;
using Infrastructure.Extensions;
using Infrastructure.Logging;
using Infrastructure.Mapping;
using MassTransit;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Projects.Application.Data.UnitOfWork;
using Projects.Application.Mapping;
using Projects.Contracts.Responses.Projects;
using Projects.Domain.Entities;
using Projects.SignalR.Commands.Projects;
using Projects.SignalR.Hubs;

namespace Projects.Application.Handlers.Projects;

public class InviteUsersToProjectHandler
    : ICommandHandler<InviteUsersToProjectCommand, InviteToProjectResponse?>
{
    private readonly IHubContext<ProjectsHub, IProjectsHub> _hubContext;
    private readonly ILogger _logger;
    private readonly IProjectsUnitOfWork _unitOfWork;
    private readonly IBus _bus;

    public InviteUsersToProjectHandler(
        ILogger<InviteUsersToProjectHandler> logger,
        IProjectsUnitOfWork unitOfWork,
        IHubContext<ProjectsHub, IProjectsHub> hubContext,
        IBus bus
    )
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
        _hubContext = hubContext;
        _bus = bus;
    }

    public async ValueTask<InviteToProjectResponse?> Handle(
        InviteUsersToProjectCommand command,
        CancellationToken cT
    )
    {
        var appUserId = command.User.Id;
        var projectIdGuid = command.Request.ProjectId.ToGuid();

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

            var message = "User does not have invite permissions in project";
            var errors = new ValidationFailure(nameof(AppUserProject), message).ToArray();
            throw new ValidationException(message, errors);
        }

        if (appUserProject.CanInvite is false)
        {
            _logger.LogError(
                "User {User} tried to invite to project {Project} but they do not have permission",
                appUserId,
                projectIdGuid
            );
            var message = "User does not have invite permissions in project";
            var errors = new ValidationFailure(nameof(AppUserProject), message).ToArray();
            throw new ValidationException(message, errors);
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
                var errors = new ValidationFailure(nameof(AppUserProject), message).ToArray();
                throw new ValidationException(message, errors);
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

        var invitedUsersToProjectMessage = new InvitedUsersToProject(
            Guid.NewGuid(),
            appUserId,
            projectIdGuid,
            userIds
        );
        await _bus.Publish(invitedUsersToProjectMessage, cT);

        // var projectEvent = new ProjectEvent(projectIdGuid, ProjectEventType.Invited, userIds);
        // projectEvent.DumpObjectJson();
        // await _bus.SendAsync(projectEvent);
        // return

        // await _unitOfWork.ProjectEventsRepository.AddAsync(projectEvent);


        return newProjectMembers;
    }
}
