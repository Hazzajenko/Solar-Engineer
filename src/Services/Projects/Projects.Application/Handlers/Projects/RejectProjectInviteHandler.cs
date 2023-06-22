using FluentValidation;
using FluentValidation.Results;
using Infrastructure.Events;
using Infrastructure.Extensions;
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

public class RejectProjectInviteHandler : ICommandHandler<RejectProjectInviteCommand, bool>
{
    private readonly ILogger<RejectProjectInviteHandler> _logger;
    private readonly IProjectsUnitOfWork _unitOfWork;
    private readonly IHubContext<ProjectsHub, IProjectsHub> _hubContext;
    private readonly IMediator _mediator;
    private readonly IBus _bus;

    public RejectProjectInviteHandler(
        ILogger<RejectProjectInviteHandler> logger,
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

    public async ValueTask<bool> Handle(RejectProjectInviteCommand command, CancellationToken cT)
    {
        var appUser = command.User;
        var projectIdGuid = command.Request.ProjectId.ToGuid();

        _logger.LogInformation(
            "User {UserUserId} - {UserUserName} rejected a project invite to project {ProjectId}",
            appUser.Id,
            appUser.UserName,
            projectIdGuid.ToString()
        );

        var projectMemberIds =
            await _unitOfWork.AppUserProjectsRepository.GetProjectMemberIdsByProjectId(
                projectIdGuid
            );

        var rejectInviteToProjectResponse = new UserRejectedInviteToProjectResponse
        {
            ProjectId = command.Request.ProjectId,
            UserId = appUser.Id.ToString(),
        };

        await _hubContext.Clients
            .Users(projectMemberIds)
            .UserRejectedInviteToProject(rejectInviteToProjectResponse);

        var notificationId = command.Request.NotificationId.ToGuid();
        var userRejectedInviteToProject = new UserRejectedInviteToProject(
            Guid.NewGuid(),
            appUser.Id,
            projectIdGuid,
            notificationId
        );
        await _bus.Publish(userRejectedInviteToProject, cT);

        return true;
    }
}
