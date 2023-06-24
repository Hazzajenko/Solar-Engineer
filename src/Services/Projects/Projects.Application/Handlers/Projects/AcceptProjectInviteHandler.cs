using ApplicationCore.Events;
using ApplicationCore.Events.Projects;
using ApplicationCore.Extensions;
using FluentValidation;
using FluentValidation.Results;
using Infrastructure.Extensions;
using Infrastructure.Mapping;
using Mapster;
using MassTransit;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Projects.Application.Data.UnitOfWork;
using Projects.Application.Mapping;
using Projects.Contracts.Data;
using Projects.Contracts.Responses.Projects;
using Projects.Domain.Entities;
using Projects.SignalR.Commands.Projects;
using Projects.SignalR.Hubs;

namespace Projects.Application.Handlers.Projects;

public class AcceptProjectInviteHandler : ICommandHandler<AcceptProjectInviteCommand, bool>
{
    private readonly ILogger<AcceptProjectInviteHandler> _logger;
    private readonly IProjectsUnitOfWork _unitOfWork;
    private readonly IHubContext<ProjectsHub, IProjectsHub> _hubContext;
    private readonly IMediator _mediator;
    private readonly IBus _bus;

    public AcceptProjectInviteHandler(
        ILogger<AcceptProjectInviteHandler> logger,
        IProjectsUnitOfWork unitOfWork,
        IHubContext<ProjectsHub, IProjectsHub> hubContext,
        IMediator mediator,
        IBus bus
    )
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
        _hubContext = hubContext;
        _mediator = mediator;
        _bus = bus;
    }

    public async ValueTask<bool> Handle(AcceptProjectInviteCommand command, CancellationToken cT)
    {
        var appUser = command.User;
        var projectIdGuid = command.Request.ProjectId.ToGuid();
        var existingAppUserProject =
            await _unitOfWork.AppUserProjectsRepository.GetByAppUserIdAndProjectIdAsync(
                appUser.Id,
                projectIdGuid
            );

        if (existingAppUserProject is not null)
        {
            _logger.LogError(
                "User {UserUserId} - {UserUserName} tried to accept a project invite to project {ProjectId} but is already apart of the project",
                appUser.Id,
                appUser.UserName,
                projectIdGuid
            );
            var message = $"User {appUser.Id} is already apart of project {projectIdGuid}";
            var errors = new ValidationFailure(nameof(AppUserProject), message).ToArray();
            throw new ValidationException(message, errors);
        }

        var requestAppUserProject = AppUserProject.Create(projectIdGuid, appUser.Id, "Member");

        await _unitOfWork.AppUserProjectsRepository.AddAsync(requestAppUserProject);
        await _unitOfWork.SaveChangesAsync();

        var appUserProject =
            await _unitOfWork.AppUserProjectsRepository.GetByAppUserIdAndProjectIdAsync(
                appUser.Id,
                projectIdGuid
            );

        appUserProject.ThrowHubExceptionIfNull();

        _logger.LogInformation(
            "User {UserUserId} - {UserUserName} accepted a project invite to project {ProjectId}",
            appUser.Id,
            appUser.UserName,
            projectIdGuid
        );

        var projectMemberIds =
            await _unitOfWork.AppUserProjectsRepository.GetProjectMemberIdsByProjectId(
                projectIdGuid
            );

        var projectUser = appUserProject.Adapt<ProjectUserDto>();

        var acceptInviteToProjectResponse = new UserAcceptedInviteToProjectResponse
        {
            ProjectId = command.Request.ProjectId,
            Member = projectUser
        };

        var projectDto = appUserProject.Adapt<ProjectDto>();
        // var projectDto = appUserProject.Project.ToDto();

        var invitedToProjectResponse = new InvitedToProjectResponse { Project = projectDto };

        await _hubContext.Clients
            .User(appUser.Id.ToString())
            .InvitedToProject(invitedToProjectResponse);
        await _hubContext.Clients
            .Users(projectMemberIds)
            .UserAcceptedInviteToProject(acceptInviteToProjectResponse);

        var notificationId = command.Request.NotificationId.ToGuid();
        var userAcceptedInviteToProject = new UserAcceptedInviteToProject(
            Guid.NewGuid(),
            appUser.Id,
            projectIdGuid,
            notificationId
        );
        await _bus.Publish(userAcceptedInviteToProject, cT);

        return true;
    }
}
