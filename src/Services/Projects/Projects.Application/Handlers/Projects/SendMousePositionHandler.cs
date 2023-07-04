using ApplicationCore.Entities;
using ApplicationCore.Events;
using ApplicationCore.Events.Projects;
using ApplicationCore.Extensions;
using Infrastructure.Logging;
using Mapster;
using MassTransit;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Projects.Application.Data.Json.ProjectTemplates;
using Projects.Application.Data.UnitOfWork;
using Projects.Application.Mapping;
using Projects.Contracts.Data;
using Projects.Contracts.Events;
using Projects.Contracts.Requests.Projects;
using Projects.Contracts.Responses.Projects;
using Projects.Domain.Entities;
using Projects.SignalR.Commands.Projects;
using Projects.SignalR.Hubs;

namespace Projects.Application.Handlers.Projects;

public class SendMousePositionHandler : ICommandHandler<SendMousePositionCommand, bool>
{
    private readonly IHubContext<ProjectsHub, IProjectsHub> _hubContext;
    private readonly ILogger<SendMousePositionHandler> _logger;
    private readonly IProjectsUnitOfWork _unitOfWork;

    public SendMousePositionHandler(
        ILogger<SendMousePositionHandler> logger,
        IProjectsUnitOfWork unitOfWork,
        IHubContext<ProjectsHub, IProjectsHub> hubContext
    )
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
        _hubContext = hubContext;
    }

    public async ValueTask<bool> Handle(SendMousePositionCommand command, CancellationToken cT)
    {
        AuthUser user = command.User;
        Guid appUserId = command.User.Id;
        SendMousePositionRequest request = command.Request;

        var activeMemberIds =
            await _unitOfWork.AppUserProjectsRepository.GetActiveProjectMemberIdsByProjectId(
                request.ProjectId.ToGuid()
            );

        if (activeMemberIds.Contains(appUserId.ToString()))
        {
            activeMemberIds = activeMemberIds.Where(id => id != appUserId.ToString()).ToList();
        }

        var response = new ReceiveUserMousePositionResponse()
        {
            UserId = appUserId.ToString(),
            ProjectId = command.Request.ProjectId,
            X = request.X,
            Y = request.Y
        };

        await _hubContext.Clients.Users(activeMemberIds).ReceiveUserMousePosition(response);

        _logger.LogInformation(
            "User {UserId} sent mouse position to project {ProjectId} at {X}, {Y}",
            user.ToAuthUserLog(),
            request.ProjectId,
            request.X,
            request.Y
        );

        return true;
    }
}
