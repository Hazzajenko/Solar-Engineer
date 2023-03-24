using Infrastructure.Exceptions;
using Infrastructure.Extensions;
using Infrastructure.Logging;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Projects.Application.Data;
using Projects.Domain.Commands.Panels;
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

        Dictionary<string, String> panelStrings = new();
        HashSet<string> panelStringIds = new();

        var diff = await panels.SelectAsync(async panel =>
        {
            var changes = updates.FirstOrDefault(x => x.Id == x.Id.ToString())!.Changes;
            if (changes.Location is not null)
            {
                var existingPanel = await _unitOfWork.PanelsRepository.ArePanelLocationsUniqueAsync(
                    projectId,
                    new[] { changes.Location }
                );
                if (existingPanel)
                    throw new HubException("Panel already exists at this location");
                panel.Location = changes.Location;
            }

            if (changes.Rotation is not null)
                panel.Rotation = (int)changes.Rotation;

            if (changes.PanelConfigId is not null)
            {
                var panelConfig = await _unitOfWork.PanelConfigsRepository.GetByIdNotNullAsync(
                    changes.PanelConfigId.ToGuid()
                );
                panel.PanelConfigId = panelConfig.Id;
            }

            do
            {
                if (changes.StringId is null)
                    break;
                var stringId = changes.StringId.ToGuid();
                var getFromHashset = panelStringIds.Contains(changes.StringId);
                if (getFromHashset)
                {
                    panel.StringId = stringId;
                    break;
                }

                var panelString = await _unitOfWork.StringsRepository.GetByIdAndProjectIdAsync(
                    stringId,
                    projectId
                );
                panelString.ThrowExceptionIfNull(new HubException("String not found"));
                panelStringIds.Add(panelString.Id.ToString());
                panel.StringId = stringId;
            } while (false);

            return panel;
        });
        panelStringIds.DumpObjectJson();
        diff.DumpObjectJson();

        HashSet<string> panelStringIds2 = new();
        foreach (var panel in panels)
        {
            var changes = updates.FirstOrDefault(x => x.Id == panel.Id.ToString())!.Changes;
            if (changes.Location is not null)
            {
                var existingPanel = await _unitOfWork.PanelsRepository.ArePanelLocationsUniqueAsync(
                    projectId,
                    new[] { changes.Location }
                );
                if (existingPanel)
                    throw new HubException("Panel already exists at this location");
                panel.Location = changes.Location;
            }

            if (changes.Rotation is not null)
                panel.Rotation = (int)changes.Rotation;

            if (changes.PanelConfigId is not null)
            {
                var panelConfig = await _unitOfWork.PanelConfigsRepository.GetByIdNotNullAsync(
                    changes.PanelConfigId.ToGuid()
                );
                panel.PanelConfigId = panelConfig.Id;
            }

            if (changes.StringId is not null)
            {
                var stringId = changes.StringId.ToGuid();
                var getFromHashset = panelStringIds2.Contains(changes.StringId);
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
                // panelStrings.Add(panelString.Id.ToString(), panelString);
                panelStringIds2.Add(panelString.Id.ToString());
                panel.StringId = stringId;
            }
        }

        panelStringIds2.DumpObjectJson();
        panels.DumpObjectJson();

        // await _unitOfWork.SaveChangesAsync();

        // _unitOfWork.PanelsRepository.UpdateMany(panels);

        /*
        var projectMembers =
            await _unitOfWork.AppUserProjectsRepository.GetProjectMemberIdsByProjectId(
                appUserProject.ProjectId
            );
        var response = panels.ToProjectEventResponseV3(
            command,
            ActionType.CreateMany,
            projectId.ToString()
        );*/
        // var response = panelDtos4.ToProjectEventResponseV3(command, ActionType.Create, projectId.ToString());
        // await _hubContext.Clients.Users(projectMembers).ReceiveProjectEvent(response);

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