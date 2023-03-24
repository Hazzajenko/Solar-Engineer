using Infrastructure.Exceptions;
using Infrastructure.Extensions;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Projects.Application.Data;
using Projects.Application.Mapping;
using Projects.Domain.Commands.Panels;
using Projects.Domain.Contracts.Data;
using Projects.SignalR.Hubs;

namespace Projects.Application.Handlers.Panels;

public class UpdatePanelHandler : ICommandHandler<UpdatePanelCommand, bool>
{
    private readonly IHubContext<ProjectsHub, IProjectsHub> _hubContext;
    private readonly ILogger<UpdatePanelHandler> _logger;
    private readonly IProjectsUnitOfWork _unitOfWork;

    public UpdatePanelHandler(
        ILogger<UpdatePanelHandler> logger,
        IProjectsUnitOfWork unitOfWork,
        IHubContext<ProjectsHub, IProjectsHub> hubContext
    )
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
        _hubContext = hubContext;
    }

    public async ValueTask<bool> Handle(UpdatePanelCommand command, CancellationToken cT)
    {
        var appUserId = command.User.Id;
        var projectId = command.Request.ProjectId.ToGuid();
        var appUserProject =
            await _unitOfWork.AppUserProjectsRepository.GetByAppUserIdAndProjectIdAsync(
                appUserId,
                projectId
            );
        appUserProject.ThrowExceptionIfNull(new HubException("User is not apart of this project"));

        var panelId = command.Request.Id.ToGuid();

        var panel = await _unitOfWork.PanelsRepository.GetPanelByIdAndProjectIdAsync(
            panelId,
            projectId
        );
        panel.ThrowExceptionIfNull(new HubException("Panel not found"));

        var changes = command.Request.Changes;

        _unitOfWork.Attach(panel);
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

        await _unitOfWork.PanelsRepository.UpdateAsync(panel);
        await _unitOfWork.SaveChangesAsync();

        var projectMembers =
            await _unitOfWork.AppUserProjectsRepository.GetProjectMemberIdsByProjectId(
                appUserProject.ProjectId
            );

        /*var response = panel.ToProjectEventResponse(command.RequestId, appUserId.ToString(), ActionType.Update,
            ModelType.Panel);*/

        var response = panel.ToProjectEventResponseFromEntity(command, ActionType.Update);
        // var response = panel.ToProjectEventResponseV3(command, ActionType.Update);
        /*await _hubContext.Clients
            .Group(appUserProject.ProjectId.ToString())
            .PanelsUpdated(panel.ToDtoList());
        await _hubContext.Clients.Users(projectMembers).PanelsUpdated(panel.ToDtoList());*/
        /*await _hubContext.Clients
            .Group(appUserProject.ProjectId.ToString())
            .ReceiveProjectEvents(response.ToIEnumerable());*/
        /*await _hubContext.Clients
            .Users(projectMembers)
            .ReceiveProjectEvents(response.ToIEnumerable());*/
        await _hubContext.Clients.Users(projectMembers).ReceiveProjectEvent(response);

        _logger.LogInformation(
            "User {User} updated panel {Panel} in project {Project}",
            appUserId.ToString(),
            panel.Id.ToString(),
            appUserProject.Project.Name
        );

        return true;
    }
}