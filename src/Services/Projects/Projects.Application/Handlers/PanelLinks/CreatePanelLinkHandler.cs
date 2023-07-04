using ApplicationCore.Exceptions;
using ApplicationCore.Extensions;
using Infrastructure.Extensions;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Projects.Application.Data.UnitOfWork;
using Projects.Application.Mapping;
using Projects.Domain.Common;
using Projects.Domain.Entities;
using Projects.SignalR.Commands.PanelLinks;
using Projects.SignalR.Commands.Panels;
using Projects.SignalR.Hubs;

namespace Projects.Application.Handlers.PanelLinks;

public class CreatePanelLinkHandler : ICommandHandler<CreatePanelLinkCommand, bool>
{
    private readonly IHubContext<ProjectsHub, IProjectsHub> _hubContext;
    private readonly ILogger<CreatePanelLinkHandler> _logger;
    private readonly IProjectsUnitOfWork _unitOfWork;

    public CreatePanelLinkHandler(
        ILogger<CreatePanelLinkHandler> logger,
        IProjectsUnitOfWork unitOfWork,
        IHubContext<ProjectsHub, IProjectsHub> hubContext
    )
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
        _hubContext = hubContext;
    }

    public async ValueTask<bool> Handle(CreatePanelLinkCommand command, CancellationToken cT)
    {
        var appUserIdGuid = command.User.Id;
        var projectIdGuid = command.Request.ProjectId.ToGuid();
        var appUserProject =
            await _unitOfWork.AppUserProjectsRepository.GetByAppUserIdAndProjectIdAsync(
                appUserIdGuid,
                projectIdGuid
            );
        appUserProject.ThrowExceptionIfNull(new HubException("User is not apart of this project"));

        var panelLinkIdGuid = command.Request.PanelLink.Id.ToGuid();
        var positiveToIdGuid = command.Request.PanelLink.PositivePanelId.ToGuid();
        var negativeToIdGuid = command.Request.PanelLink.NegativePanelId.ToGuid();
        var stringIdGuid = command.Request.PanelLink.StringId.ToGuid();

        var positiveToPanel = await _unitOfWork.PanelsRepository.GetPanelByIdAndProjectIdAsync(
            positiveToIdGuid,
            projectIdGuid
        );
        positiveToPanel.ThrowExceptionIfNull(new HubException("PositiveTo panel does not exist"));

        var negativeToPanel = await _unitOfWork.PanelsRepository.GetPanelByIdAndProjectIdAsync(
            negativeToIdGuid,
            projectIdGuid
        );
        negativeToPanel.ThrowExceptionIfNull(new HubException("NegativeTo panel does not exist"));

        var existingStringId = await _unitOfWork.StringsRepository.GetByIdAndProjectIdAsync(
            stringIdGuid,
            projectIdGuid
        );
        existingStringId.ThrowExceptionIfNull(new HubException("String does not exist"));

        var linePoints = command.Request.PanelLink.LinePoints;

        var panelLink = PanelLink.Create(
            panelLinkIdGuid,
            projectIdGuid,
            stringIdGuid,
            positiveToIdGuid,
            negativeToIdGuid,
            linePoints,
            appUserIdGuid
        );

        panelLink = await _unitOfWork.PanelLinksRepository.AddAndSaveChangesAsync(panelLink);

        positiveToPanel.LinkNegativeToId = panelLink.Id;
        negativeToPanel.LinkPositiveToId = panelLink.Id;

        await _unitOfWork.PanelsRepository.UpdateAndSaveChangesAsync(positiveToPanel);
        await _unitOfWork.PanelsRepository.UpdateAndSaveChangesAsync(negativeToPanel);

        var panelLinkResponse = panelLink.ToProjectEventResponseFromEntity(
            command,
            ActionType.Create
        );

        var projectMembers =
            await _unitOfWork.AppUserProjectsRepository.GetProjectMemberIdsByProjectId(
                appUserProject.ProjectId
            );

        await _hubContext.Clients.Users(projectMembers).ReceiveProjectEvent(panelLinkResponse);

        _logger.LogInformation(
            "User {User} created panel link {Panel} in project {Project}",
            command.User.ToAuthUserLog(),
            panelLink.Id.ToString(),
            appUserProject.Project.Id.ToString()
        );

        return true;
    }
}
