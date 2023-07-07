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

public class CreateManyPanelsHandler : ICommandHandler<CreateManyPanelsCommand, bool>
{
    private readonly IHubContext<ProjectsHub, IProjectsHub> _hubContext;
    private readonly ILogger<CreateManyPanelsHandler> _logger;
    private readonly IProjectsUnitOfWork _unitOfWork;

    public CreateManyPanelsHandler(
        ILogger<CreateManyPanelsHandler> logger,
        IProjectsUnitOfWork unitOfWork,
        IHubContext<ProjectsHub, IProjectsHub> hubContext
    )
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
        _hubContext = hubContext;
    }

    public async ValueTask<bool> Handle(CreateManyPanelsCommand command, CancellationToken cT)
    {
        Guid appUserId = command.User.Id;
        var projectId = command.ProjectId.ToGuid();
        AppUserProject? appUserProject =
            await _unitOfWork.AppUserProjectsRepository.GetByAppUserIdAndProjectIdAsync(
                appUserId,
                projectId
            );
        appUserProject.ThrowHubExceptionIfNull("User is not apart of this project");

        var panelStringId = command.Request.StringId;
        var panelHasString = panelStringId.Equals(String.UndefinedStringId) is false;

        String? panelString = panelHasString
            ? await _unitOfWork.StringsRepository.GetByIdAndProjectIdAsync(
                panelStringId.ToGuid(),
                projectId
            )
            : await _unitOfWork.StringsRepository.GetUndefinedStringByProjectIdAsync(projectId);

        var projectDoesNotHaveUndefinedString = panelString is null && !panelHasString;

        if (projectDoesNotHaveUndefinedString)
        {
            panelString = String.CreateUndefined(projectId, appUserId);

            await _unitOfWork.StringsRepository.AddAsync(panelString);
            await _unitOfWork.SaveChangesAsync();
        }

        panelString.ThrowHubExceptionIfNull("String does not exist");

        var panelConfigId = command.Request.PanelConfigId;

        PanelConfig? panelConfig = panelConfigId.Equals(PanelConfig.DefaultPanelConfigId)
            ? await _unitOfWork.PanelConfigsRepository.GetByBrandAndModelAsync("Longi", "Himo555m")
            : await _unitOfWork.PanelConfigsRepository.GetByIdAsync(panelConfigId.ToGuid());

        panelConfig.ThrowHubExceptionIfNull("Panel config does not exist");

        var panels = command.Request.Panels.Select(
            x =>
                Panel.Create(
                    x.Id.ToGuid(),
                    appUserProject.ProjectId,
                    panelString.Id,
                    panelConfig.Id,
                    x.Location,
                    command.Request.Angle,
                    appUserId
                )
        );

        panels = await _unitOfWork.PanelsRepository.AddManyAndSaveChangesAsync(panels);
        var projectMembers =
            await _unitOfWork.AppUserProjectsRepository.GetProjectMemberIdsByProjectId(
                appUserProject.ProjectId
            );
        ProjectEventResponse response = panels.ToProjectEventResponseFromEntityList(
            command,
            ActionType.CreateMany
        );
        await _hubContext.Clients.Users(projectMembers).ReceiveProjectEvent(response);

        _logger.LogInformation(
            "User {UserName}: Created {Amount} Panels in Project {Project}",
            command.User.UserName,
            panels.Count(),
            appUserProject.Project.Id.ToString()
        );

        return true;
    }
}
