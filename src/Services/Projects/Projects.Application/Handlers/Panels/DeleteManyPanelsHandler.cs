using Infrastructure.Exceptions;
using Infrastructure.Extensions;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Projects.Application.Data.UnitOfWork;
using Projects.Application.Mapping;
using Projects.Domain.Commands.Panels;
using Projects.Domain.Contracts.Data;
using Projects.Domain.Entities;
using Projects.SignalR.Hubs;

namespace Projects.Application.Handlers.Panels;

public class DeleteManyPanelsHandler : ICommandHandler<DeleteManyPanelsCommand, bool>
{
    private readonly IHubContext<ProjectsHub, IProjectsHub> _hubContext;
    private readonly ILogger<DeleteManyPanelsHandler> _logger;
    private readonly IProjectsUnitOfWork _unitOfWork;

    public DeleteManyPanelsHandler(
        ILogger<DeleteManyPanelsHandler> logger,
        IProjectsUnitOfWork unitOfWork,
        IHubContext<ProjectsHub, IProjectsHub> hubContext
    )
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
        _hubContext = hubContext;
    }

    public async ValueTask<bool> Handle(DeleteManyPanelsCommand command, CancellationToken cT)
    {
        var appUserId = command.User.Id;
        var projectId = command.ProjectId.ToGuid();
        var appUserProject =
            await _unitOfWork.AppUserProjectsRepository.GetByAppUserIdAndProjectIdAsync(
                appUserId,
                projectId
            );
        appUserProject.ThrowExceptionIfNull(new HubException("User is not apart of this project"));

        var panelIdGuids = command.Request.PanelIds.Select(x => x.Id.ToGuid()).ToList();

        var panels = await _unitOfWork.PanelsRepository.GetManyPanelsAsync(projectId, panelIdGuids);

        if (panels.Any() is false)
            throw new HubException("No panels exist");
        if (panels.Count() != panelIdGuids.Count())
            throw new HubException("Some panels do not exist");

        await _unitOfWork.PanelsRepository.DeleteManyPanelsAsync(projectId, panelIdGuids);

        var projectMembers =
            await _unitOfWork.AppUserProjectsRepository.GetProjectMemberIdsByProjectId(
                appUserProject.ProjectId
            );
        var panelIds = panels.Select(x => x.Id.ToString()).ToList();
        /*var response = panelIds.ToProjectEventResponseWithStringListV3(
            command,
            ActionType.DeleteMany,
            projectId.ToString(),
            typeof(Panel)
        );*/
        var response = panelIds.ToProjectEventResponseFromIdList<Panel>(
            command,
            ActionType.DeleteMany
        );
        await _hubContext.Clients.Users(projectMembers).ReceiveProjectEvent(response);

        _logger.LogInformation(
            "User {User} deleted {Amount} {Panels} in project {Project}",
            appUserId.ToString(),
            panels.Count(),
            panels.Count() == 1 ? "panel" : "panels",
            appUserProject.Project.Id.ToString()
        );

        return true;
    }
}