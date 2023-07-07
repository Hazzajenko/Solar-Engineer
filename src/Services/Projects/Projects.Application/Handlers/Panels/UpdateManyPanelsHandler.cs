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
using Projects.SignalR.Commands.Panels;
using Projects.SignalR.Hubs;

namespace Projects.Application.Handlers.Panels;

public class UpdateManyPanelsHandler : ICommandHandler<UpdateManyPanelsCommand, bool>
{
    private readonly IHubContext<ProjectsHub, IProjectsHub> _hubContext;
    private readonly ILogger<UpdateManyPanelsHandler> _logger;
    private readonly IProjectsUnitOfWork _unitOfWork;

    public UpdateManyPanelsHandler(
        ILogger<UpdateManyPanelsHandler> logger,
        IProjectsUnitOfWork unitOfWork,
        IHubContext<ProjectsHub, IProjectsHub> hubContext
    )
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
        _hubContext = hubContext;
    }

    public async ValueTask<bool> Handle(UpdateManyPanelsCommand command, CancellationToken cT)
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
        var panelIds = updates.Select(x => x.Id.ToGuid());
        var panels = await _unitOfWork.PanelsRepository.GetManyPanelsAsync(projectId, panelIds);

        if (panels.Count() != updates.Count())
            throw new HubException("One or more panels do not exist");

        var newConfigIds = updates
            .Where(x => x.Changes?.PanelConfigId is not null)
            .Select(x => x.Changes.PanelConfigId!)
            .Distinct()
            .Select(Guid.Parse)
            .ToList();

        var panelConfigs = await _unitOfWork.PanelConfigsRepository.GetPanelConfigsByIdsAsync(
            newConfigIds
        );

        var panelConfigIds = panelConfigs.Select(x => x.Id).ToHashSet();

        HashSet<string> panelStringIds = new();
        foreach (Panel panel in panels)
        {
            MakePanelChanges(updates, panel, panelStringIds, panelConfigIds);
        }

        panels = await _unitOfWork.PanelsRepository.UpdateManyAndSaveChangesAsync(panels);

        var projectMembers =
            await _unitOfWork.AppUserProjectsRepository.GetProjectMemberIdsByProjectId(
                appUserProject.ProjectId
            );
        ProjectEventResponse response = panels.ToProjectEventResponseFromEntityList(
            command,
            ActionType.UpdateMany
        );
        await _hubContext.Clients.Users(projectMembers).ReceiveProjectEvent(response);

        _logger.LogInformation(
            "User {UserName}: Updated {PanelAmount} Panels in Project {ProjectName}",
            command.User.UserName,
            panels.Count(),
            appUserProject.Project.Name
        );

        return true;
    }

    private static void MakePanelChanges(
        IEnumerable<ProjectItemUpdateRequest<PanelChanges>> updates,
        Panel panel,
        ISet<string> panelStringIds,
        IReadOnlySet<Guid> panelConfigIds
    )
    {
        PanelChanges changes = updates.FirstOrDefault(x => x.Id == panel.Id.ToString())!.Changes;
        if (changes.Location is not null)
            panel.Location = changes.Location;

        if (changes.Angle is not null)
            panel.Angle = (int)changes.Angle;

        if (changes.PanelConfigId is not null)
        {
            if (!panelConfigIds.Contains(changes.PanelConfigId.ToGuid()))
                throw new HubException("PanelConfig does not exist");
            panel.PanelConfigId = changes.PanelConfigId.ToGuid();
        }

        if (changes.StringId is null)
            return;
        var stringId = changes.StringId.ToGuid();
        var getFromHashset = panelStringIds.Contains(changes.StringId);
        if (getFromHashset)
        {
            panel.StringId = stringId;
            return;
        }
        panelStringIds.Add(changes.StringId);
        panel.StringId = stringId;
    }
}
