using Infrastructure.Exceptions;
using Infrastructure.Extensions;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Projects.API.Contracts.Data;
using Projects.API.Data;
using Projects.API.Hubs;
using Projects.API.Mapping;

namespace Projects.API.Handlers.Panels.UpdateManyPanels;

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
                /*var stringInProject = await _unitOfWork.StringsRepository.GetStringByIdAndProjectIdAsync(
                    stringId,
                    projectId
                );*/
                // stringInProject.ThrowExceptionIfNull(new HubException("String not found"));
                panel.StringId = stringId;
            }
        }

        await _unitOfWork.SaveChangesAsync();

        // _unitOfWork.PanelsRepository.UpdateMany(panels);

        var projectMembers =
            await _unitOfWork.AppUserProjectsRepository.GetProjectMemberIdsByProjectId(
                appUserProject.ProjectId
            );
        var response = panels.ToProjectEventResponseV3(
            command,
            ActionType.CreateMany,
            projectId.ToString()
        );
        // var response = panelDtos4.ToProjectEventResponseV3(command, ActionType.Create, projectId.ToString());
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