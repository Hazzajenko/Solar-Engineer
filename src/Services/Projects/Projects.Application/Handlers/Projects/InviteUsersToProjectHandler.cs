using ApplicationCore.Events;
using ApplicationCore.Events.Projects;
using ApplicationCore.Extensions;
using EventBus.Domain.ProjectsEvents;
using FluentValidation;
using FluentValidation.Results;
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
    : ICommandHandler<InviteUsersToProjectCommand, UsersSentInviteToProjectResponse?>
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

    public async ValueTask<UsersSentInviteToProjectResponse?> Handle(
        InviteUsersToProjectCommand command,
        CancellationToken cT
    )
    {
        var appUserId = command.User.Id;
        var projectId = command.Request.ProjectId.ToGuid();

        var appUserProject =
            await _unitOfWork.AppUserProjectsRepository.GetByAppUserIdAndProjectIdAsync(
                appUserId,
                projectId
            );
        if (appUserProject is null)
        {
            _logger.LogError(
                "User {User} tried to invite to project {Project} without a App User Project Link",
                appUserId,
                projectId
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
                projectId
            );
            var message = "User does not have invite permissions in project";
            var errors = new ValidationFailure(nameof(AppUserProject), message).ToArray();
            throw new ValidationException(message, errors);
        }

        var userIds = command.Request.Invites.Select(x => x.UserId).ToList();
        var projectMembers =
            await _unitOfWork.AppUserProjectsRepository.GetProjectMemberIdsByProjectId(projectId);

        await _unitOfWork.SaveChangesAsync();

        var newProjectMembers = new UsersSentInviteToProjectResponse
        {
            ProjectId = command.Request.ProjectId,
            InvitedByUserId = appUserId.ToString(),
            InvitedUserIds = userIds
        };

        /*var projectDto = appUserProject.Project.ToDto();

        var invitedToProjectResponse = new InvitedToProjectResponse { Project = projectDto };

        await _hubContext.Clients.Users(userIds).InvitedToProject(invitedToProjectResponse);*/
        await _hubContext.Clients.Users(projectMembers).UsersSentInviteToProject(newProjectMembers);

        _logger.LogInformation(
            "User {User} invited users {Users} to project {Project}",
            appUserId,
            userIds,
            appUserProject.Project.Name
        );

        var project = appUserProject.Project;
        var projectName = project.Name;
        // TODO get project photo url
        var projectPhotoUrl = "";

        var invitedUsersToProjectMessage = new InvitedUsersToProject(
            Guid.NewGuid(),
            appUserId,
            projectId,
            projectName,
            projectPhotoUrl,
            userIds
        );
        await _bus.Publish(invitedUsersToProjectMessage, cT);

        return newProjectMembers;
    }
}
