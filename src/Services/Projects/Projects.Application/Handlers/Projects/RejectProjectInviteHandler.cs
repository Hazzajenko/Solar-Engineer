using ApplicationCore.Entities;
using ApplicationCore.Events;
using ApplicationCore.Events.Projects;
using ApplicationCore.Extensions;
using FluentValidation;
using FluentValidation.Results;
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
    private readonly IBus _bus;

    public RejectProjectInviteHandler(
        ILogger<RejectProjectInviteHandler> logger,
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

    public async ValueTask<bool> Handle(RejectProjectInviteCommand command, CancellationToken cT)
    {
        AuthUser authUser = command.User;
        var projectIdGuid = command.Request.ProjectId.ToGuid();

        Project? project = await _unitOfWork.ProjectsRepository.GetByIdAsync(projectIdGuid);
        if (project is null)
        {
            _logger.LogError(
                "User {UserName}: Tried to reject a project invite to project {ProjectId} but the project does not exist",
                authUser.UserName,
                projectIdGuid
            );
            return false;
        }

        _logger.LogInformation(
            "User {UserName}: Rejected a project invite to Project {ProjectName}",
            command.User.UserName,
            project.Name
        );

        var projectMemberIds =
            await _unitOfWork.AppUserProjectsRepository.GetProjectMemberIdsByProjectId(
                projectIdGuid
            );

        var rejectInviteToProjectResponse = new UserRejectedInviteToProjectResponse
        {
            ProjectId = command.Request.ProjectId,
            UserId = authUser.Id.ToString(),
        };

        await _hubContext.Clients
            .Users(projectMemberIds)
            .UserRejectedInviteToProject(rejectInviteToProjectResponse);

        var notificationId = command.Request.NotificationId.ToGuid();
        var userRejectedInviteToProject = new UserRejectedInviteToProject(
            Guid.NewGuid(),
            authUser.Id,
            projectIdGuid,
            notificationId
        );
        await _bus.Publish(userRejectedInviteToProject, cT);

        return true;
    }
}
