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
        Guid appUserIdGuid = command.User.Id;
        var projectIdGuid = command.Request.ProjectId.ToGuid();
        AppUserProject? appUserProject =
            await _unitOfWork.AppUserProjectsRepository.GetByAppUserIdAndProjectIdAsync(
                appUserIdGuid,
                projectIdGuid
            );
        appUserProject.ThrowHubExceptionIfNull("User is not apart of this project");

        var panelLinkIdGuid = command.Request.PanelLink.Id.ToGuid();
        var positiveToIdGuid = command.Request.PanelLink.PositivePanelId.ToGuid();
        var negativeToIdGuid = command.Request.PanelLink.NegativePanelId.ToGuid();
        var stringIdGuid = command.Request.PanelLink.StringId.ToGuid();

        Panel? positiveToPanel = await _unitOfWork.PanelsRepository.GetPanelByIdAndProjectIdAsync(
            positiveToIdGuid,
            projectIdGuid
        );
        positiveToPanel.ThrowHubExceptionIfNull("PositiveTo panel does not exist");

        Panel? negativeToPanel = await _unitOfWork.PanelsRepository.GetPanelByIdAndProjectIdAsync(
            negativeToIdGuid,
            projectIdGuid
        );
        negativeToPanel.ThrowHubExceptionIfNull("NegativeTo panel does not exist");

        String existingStringId = await _unitOfWork.StringsRepository.GetByIdAndProjectIdAsync(
            stringIdGuid,
            projectIdGuid
        );
        existingStringId.ThrowHubExceptionIfNull("String does not exist");

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

        ProjectEventResponse panelLinkResponse = panelLink.ToProjectEventResponseFromEntity(
            command,
            ActionType.Create
        );

        var projectMembers =
            await _unitOfWork.AppUserProjectsRepository.GetProjectMemberIdsByProjectId(
                appUserProject.ProjectId
            );

        await _hubContext.Clients.Users(projectMembers).ReceiveProjectEvent(panelLinkResponse);

        _logger.LogInformation(
            "User {UserName}: Created Panel Link {PanelLinkId} in Project {ProjectName}",
            command.User.UserName,
            panelLink.Id,
            appUserProject.Project.Name
        );

        return true;
    }
}
