using Infrastructure.Extensions;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Projects.API.Data;
using Projects.API.Hubs;
using Projects.API.Mapping;

namespace Projects.API.Handlers.Panels.UpdatePanel;

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
        var appUserId = command.User.GetGuidUserId();
        var projectId = command.UpdatePanel.ProjectId.ToGuid();
        var appUserProject =
            await _unitOfWork.AppUserProjectsRepository.GetByAppUserIdAndProjectIdAsync(
                appUserId,
                projectId
            );

        var panelId = command.UpdatePanel.Update.Id.ToGuid();

        var panel = await _unitOfWork.PanelsRepository.GetPanelByIdAndProjectIdAsync(
            panelId,
            projectId
        );

        var changes = command.UpdatePanel.Update.Changes;

        _unitOfWork.Attach(panel);
        if (changes.Location is not null)
            panel.Location = changes.Location;

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

        await _hubContext.Clients
            .Group(appUserProject.ProjectId.ToString())
            .PanelsUpdated(panel.ToDtoList());
        await _hubContext.Clients.Users(projectMembers).PanelsUpdated(panel.ToDtoList());

        _logger.LogInformation(
            "User {User} updated panel {Panel} in project {Project}",
            appUserId.ToString(),
            panel.Id.ToString(),
            appUserProject.Project.Name
        );

        return true;
    }
}