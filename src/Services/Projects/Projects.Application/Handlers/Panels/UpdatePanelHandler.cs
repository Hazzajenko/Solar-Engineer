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

        var panelId = command.Request.Update.Id.ToGuid();

        var panel = await _unitOfWork.PanelsRepository.GetPanelByIdAndProjectIdAsync(
            panelId,
            projectId
        );
        panel.ThrowExceptionIfNull(new HubException("Panel not found"));

        var changes = command.Request.Update.Changes;

        _unitOfWork.Attach(panel);
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

        await _unitOfWork.PanelsRepository.UpdateAsync(panel);
        await _unitOfWork.SaveChangesAsync();

        var projectMembers =
            await _unitOfWork.AppUserProjectsRepository.GetProjectMemberIdsByProjectId(
                appUserProject.ProjectId
            );

        var response = panel.ToProjectEventResponseFromEntity(command, ActionType.Update);
        await _hubContext.Clients.Users(projectMembers).ReceiveProjectEvent(response);

        _logger.LogInformation(
            "User {User} updated panel {Panel} in project {Project}",
            command.User.ToAuthUserLog(),
            panel.Id.ToString(),
            appUserProject.Project.Name
        );

        return true;
    }
}
