﻿using ApplicationCore.Exceptions;
using ApplicationCore.Extensions;
using Infrastructure.Extensions;
using MapsterMapper;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Projects.Application.Data.UnitOfWork;
using Projects.Application.Mapping;
using Projects.Domain.Common;
using Projects.Domain.Entities;
using Projects.SignalR.Commands.PanelLinks;
using Projects.SignalR.Hubs;

namespace Projects.Application.Handlers.PanelLinks;

public class DeletePanelLinkHandler : ICommandHandler<DeletePanelLinkCommand, bool>
{
    private readonly IHubContext<ProjectsHub, IProjectsHub> _hubContext;
    private readonly ILogger<DeletePanelLinkHandler> _logger;
    private readonly IProjectsUnitOfWork _unitOfWork;

    public DeletePanelLinkHandler(
        ILogger<DeletePanelLinkHandler> logger,
        IProjectsUnitOfWork unitOfWork,
        IHubContext<ProjectsHub, IProjectsHub> hubContext
    )
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
        _hubContext = hubContext;
    }

    public async ValueTask<bool> Handle(DeletePanelLinkCommand command, CancellationToken cT)
    {
        var appUserId = command.User.Id;
        var projectId = command.ProjectId.ToGuid();
        var appUserProject =
            await _unitOfWork.AppUserProjectsRepository.GetByAppUserIdAndProjectIdAsync(
                appUserId,
                projectId
            );
        appUserProject.ThrowExceptionIfNull(new HubException("User is not apart of this project"));

        var panelLinkId = command.Request.PanelLinkId.ToGuid();
        var deleteResult =
        /*await _unitOfWork.PanelLinksRepository.DeletePanelLinkByProjectIdAndIdAsync(
            projectId,
            panelLinkId
        );*/
        await _unitOfWork.PanelLinksRepository.ExecuteDeleteAsync(
            x => x.ProjectId == projectId && x.Id == panelLinkId
        );
        if (deleteResult > 1)
        {
            _logger.LogWarning(
                "User {User} deleted {DeleteResult} Panel Links in project {Project}",
                appUserId.ToString(),
                deleteResult.ToString(),
                appUserProject.Project.Id.ToString()
            );
            throw new HubException("Deleted more than one Panel Link");
        }

        var panelLinkIdString = panelLinkId.ToString();
        var response = panelLinkIdString.ToProjectEventResponseFromId<PanelLink>(
            command,
            ActionType.Delete
        );

        var projectMembers =
            await _unitOfWork.AppUserProjectsRepository.GetProjectMemberIdsByProjectId(
                appUserProject.ProjectId
            );

        await _hubContext.Clients.Users(projectMembers).ReceiveProjectEvent(response);

        _logger.LogInformation(
            "User {User} deleted Panel Link {PanelLink} in project {Project}",
            appUserId.ToString(),
            panelLinkIdString,
            appUserProject.Project.Id.ToString()
        );

        return true;
    }
}
