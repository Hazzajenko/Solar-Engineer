using Infrastructure.Exceptions;
using Infrastructure.Extensions;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Projects.Application.Data.UnitOfWork;
using Projects.Application.Mapping;
using Projects.Domain.Common;
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
        var appUserId = command.User.Id;
        var projectId = command.ProjectId.ToGuid();
        var appUserProject =
            await _unitOfWork.AppUserProjectsRepository.GetByAppUserIdAndProjectIdAsync(
                appUserId,
                projectId
            );
        appUserProject.ThrowExceptionIfNull(new HubException("User is not apart of this project"));

        var updates = command.Request.Updates;
        var panelLinkIds = updates.Select(x => x.Id.ToGuid());
        var panelLinks =
            await _unitOfWork.PanelLinksRepository.GetManyPanelLinksByProjectIdAndIdsAsync(
                projectId,
                panelLinkIds
            );

        if (panelLinks.Count() != updates.Count())
            throw new HubException("One or more panels do not exist");

        foreach (var panel in panelLinks)
        {
            var changes = updates.FirstOrDefault(x => x.Id == panel.Id.ToString())!.Changes;
            if (changes.PanelNegativeToId is not null)
            {
                var negativePanel = await _unitOfWork.PanelsRepository.GetByIdAsync(
                    changes.PanelNegativeToId.ToGuid()
                );
                negativePanel.ThrowExceptionIfNull(new HubException("Panel not found"));
                panel.PanelNegativeToId = negativePanel.Id;
            }

            if (changes.PanelPositiveToId is not null)
            {
                var positivePanel = await _unitOfWork.PanelsRepository.GetByIdAsync(
                    changes.PanelPositiveToId.ToGuid()
                );
                positivePanel.ThrowExceptionIfNull(new HubException("Panel not found"));
                panel.PanelPositiveToId = positivePanel.Id;
            }

            if (changes.Points is not null)
            {
                panel.Points = changes.Points;
            }
        }

        panelLinks = await _unitOfWork.PanelLinksRepository.UpdateManyAndSaveChangesAsync(
            panelLinks
        );

        var projectMembers =
            await _unitOfWork.AppUserProjectsRepository.GetProjectMemberIdsByProjectId(
                appUserProject.ProjectId
            );
        var response = panelLinks.ToProjectEventResponseFromEntityList(
            command,
            ActionType.UpdateMany
        );
        await _hubContext.Clients.Users(projectMembers).ReceiveProjectEvent(response);

        _logger.LogInformation(
            "User {User} created {Amount} {PanelLinks} in project {Project}",
            appUserId.ToString(),
            panelLinks.Count(),
            panelLinks.Count() == 1 ? "Panel Link" : "Panel Links",
            appUserProject.Project.Id.ToString()
        );

        return true;
    }
}
