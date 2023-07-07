using ApplicationCore.Exceptions;
using ApplicationCore.Extensions;
using Infrastructure.Extensions;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Projects.Application.Data.UnitOfWork;
using Projects.Application.Mapping;
using Projects.Contracts.Responses;
using Projects.Domain.Common;
using Projects.Domain.Entities;
using Projects.SignalR.Commands.PanelLinks;
using Projects.SignalR.Hubs;

namespace Projects.Application.Handlers.PanelLinks;

public class UpdateManyPanelLinksHandler : ICommandHandler<UpdateManyPanelLinksCommand, bool>
{
    private readonly IHubContext<ProjectsHub, IProjectsHub> _hubContext;
    private readonly ILogger<UpdateManyPanelLinksHandler> _logger;
    private readonly IProjectsUnitOfWork _unitOfWork;

    public UpdateManyPanelLinksHandler(
        ILogger<UpdateManyPanelLinksHandler> logger,
        IProjectsUnitOfWork unitOfWork,
        IHubContext<ProjectsHub, IProjectsHub> hubContext
    )
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
        _hubContext = hubContext;
    }

    public async ValueTask<bool> Handle(UpdateManyPanelLinksCommand command, CancellationToken cT)
    {
        Guid appUserId = command.User.Id;
        var projectId = command.ProjectId.ToGuid();
        AppUserProject? appUserProject =
            await _unitOfWork.AppUserProjectsRepository.GetByAppUserIdAndProjectIdAsync(
                appUserId,
                projectId
            );
        appUserProject.ThrowHubExceptionIfNull("User is not apart of this project");

        var updates = command.Request.Updates;
        var panelLinkIds = updates.Select(x => x.Id.ToGuid());
        var panelLinks =
            await _unitOfWork.PanelLinksRepository.GetManyPanelLinksByProjectIdAndIdsAsync(
                projectId,
                panelLinkIds
            );

        if (panelLinks.Count() != updates.Count())
            throw new HubException("One or more panels do not exist");

        foreach (PanelLink panel in panelLinks)
        {
            PanelLinkChanges changes = updates
                .FirstOrDefault(x => x.Id == panel.Id.ToString())!
                .Changes;
            if (changes.PanelNegativeToId is not null)
            {
                Panel? negativePanel = await _unitOfWork.PanelsRepository.GetByIdAsync(
                    changes.PanelNegativeToId.ToGuid()
                );
                negativePanel.ThrowHubExceptionIfNull("Panel not found");
                panel.NegativePanelId = negativePanel.Id;
            }

            if (changes.PanelPositiveToId is not null)
            {
                Panel? positivePanel = await _unitOfWork.PanelsRepository.GetByIdAsync(
                    changes.PanelPositiveToId.ToGuid()
                );
                positivePanel.ThrowHubExceptionIfNull("Panel not found");
                panel.PositivePanelId = positivePanel.Id;
            }

            if (changes.LinePoints is not null)
            {
                panel.LinePoints = changes.LinePoints;
            }
        }

        panelLinks = await _unitOfWork.PanelLinksRepository.UpdateManyAndSaveChangesAsync(
            panelLinks
        );

        var projectMembers =
            await _unitOfWork.AppUserProjectsRepository.GetProjectMemberIdsByProjectId(
                appUserProject.ProjectId
            );
        ProjectEventResponse response = panelLinks.ToProjectEventResponseFromEntityList(
            command,
            ActionType.UpdateMany
        );
        await _hubContext.Clients.Users(projectMembers).ReceiveProjectEvent(response);

        _logger.LogInformation(
            "User {UserName}: Created {PanelLinkAmount} Panel Links in Project {ProjectName}",
            command.User.ToAuthUserLog(),
            panelLinks.Count(),
            appUserProject.Project.Name
        );

        return true;
    }
}
