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
        Guid appUserId = command.User.Id;
        var projectId = command.Request.ProjectId.ToGuid();
        AppUserProject? appUserProject =
            await _unitOfWork.AppUserProjectsRepository.GetByAppUserIdAndProjectIdAsync(
                appUserId,
                projectId
            );
        appUserProject.ThrowHubExceptionIfNull("User is not apart of this project");

        var panelId = command.Request.Update.Id.ToGuid();

        Panel? panel = await _unitOfWork.PanelsRepository.GetPanelByIdAndProjectIdAsync(
            panelId,
            projectId
        );
        panel.ThrowHubExceptionIfNull("Panel not found");

        PanelChanges changes = command.Request.Update.Changes;

        _unitOfWork.Attach(panel);
        if (changes.Location is not null)
            panel.Location = changes.Location;

        if (changes.Angle is not null)
            panel.Angle = (int)changes.Angle;

        if (changes.PanelConfigId is not null)
        {
            PanelConfig? panelConfig = await _unitOfWork.PanelConfigsRepository.GetByIdAsync(
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

        ProjectEventResponse response = panel.ToProjectEventResponseFromEntity(
            command,
            ActionType.Update
        );
        await _hubContext.Clients.Users(projectMembers).ReceiveProjectEvent(response);

        _logger.LogInformation(
            "User {UserName}: Updated Panel {PanelId} in Project {ProjectName}",
            command.User.UserName,
            panel.Id,
            appUserProject.Project.Name
        );

        return true;
    }
}
