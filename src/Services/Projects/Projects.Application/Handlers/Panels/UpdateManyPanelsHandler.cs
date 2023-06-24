using ApplicationCore.Exceptions;
using ApplicationCore.Extensions;
using Infrastructure.Extensions;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Projects.Application.Data.UnitOfWork;
using Projects.Application.Mapping;
using Projects.Domain.Common;
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
        var appUserId = command.User.Id;
        var projectId = command.ProjectId.ToGuid();
        var appUserProject =
            await _unitOfWork.AppUserProjectsRepository.GetByAppUserIdAndProjectIdAsync(
                appUserId,
                projectId
            );
        appUserProject.ThrowExceptionIfNull(new HubException("User is not apart of this project"));

        var updates = command.Request.Updates;
        var panelIds = updates.Select(x => x.Id.ToGuid());
        var panels = await _unitOfWork.PanelsRepository.GetManyPanelsAsync(projectId, panelIds);

        if (panels.Count() != updates.Count())
            throw new HubException("One or more panels do not exist");

        HashSet<string> panelStringIds = new();
        foreach (var panel in panels)
        {
            var changes = updates.FirstOrDefault(x => x.Id == panel.Id.ToString())!.Changes;
            if (changes.Location is not null)
                panel.Location = changes.Location;

            if (changes.Angle is not null)
                panel.Angle = (int)changes.Angle;

            if (changes.PanelConfigId is not null)
            {
                var panelConfig = await _unitOfWork.PanelConfigsRepository.GetByIdAsync(
                    changes.PanelConfigId.ToGuid()
                );
                panelConfig.ThrowHubExceptionIfNull();
                panel.PanelConfigId = panelConfig.Id;
            }

            if (changes.StringId is null)
                continue;
            var stringId = changes.StringId.ToGuid();
            var getFromHashset = panelStringIds.Contains(changes.StringId);
            if (getFromHashset)
            {
                panel.StringId = stringId;
                continue;
            }

            var panelString = await _unitOfWork.StringsRepository.GetByIdAndProjectIdAsync(
                stringId,
                projectId
            );
            panelString.ThrowExceptionIfNull(new HubException("String not found"));
            panelStringIds.Add(panelString.Id.ToString());
            panel.StringId = stringId;
        }

        panels = await _unitOfWork.PanelsRepository.UpdateManyAndSaveChangesAsync(panels);

        var projectMembers =
            await _unitOfWork.AppUserProjectsRepository.GetProjectMemberIdsByProjectId(
                appUserProject.ProjectId
            );
        var response = panels.ToProjectEventResponseFromEntityList(command, ActionType.UpdateMany);
        await _hubContext.Clients.Users(projectMembers).ReceiveProjectEvent(response);

        _logger.LogInformation(
            "User {User} created {Amount} {Panels} in project {Project}",
            appUserId.ToString(),
            panels.Count(),
            panels.Count() == 1 ? "panel" : "panels",
            appUserProject.Project.Id.ToString()
        );

        return true;
    }
}
