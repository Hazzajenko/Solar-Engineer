using Infrastructure.Exceptions;
using Infrastructure.Extensions;
using MapsterMapper;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Projects.API.Contracts.Data;
using Projects.API.Data;
using Projects.API.Entities;
using Projects.API.Hubs;
using Projects.API.Mapping;

namespace Projects.API.Handlers.Panels.CreateManyPanels;

public class CreateManyPanelsHandler : ICommandHandler<CreateManyPanelsCommand, bool>
{
    private readonly IHubContext<ProjectsHub, IProjectsHub> _hubContext;
    private readonly ILogger<CreateManyPanelsHandler> _logger;
    private readonly IMapper _mapper;
    private readonly IProjectsUnitOfWork _unitOfWork;

    public CreateManyPanelsHandler(
        ILogger<CreateManyPanelsHandler> logger,
        IProjectsUnitOfWork unitOfWork,
        IHubContext<ProjectsHub, IProjectsHub> hubContext,
        IMapper mapper
    )
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
        _hubContext = hubContext;
        _mapper = mapper;
    }

    public async ValueTask<bool> Handle(CreateManyPanelsCommand command, CancellationToken cT)
    {
        var appUserId = command.User.Id;
        var projectId = command.ProjectId.ToGuid();
        var appUserProject =
            await _unitOfWork.AppUserProjectsRepository.GetByAppUserIdAndProjectIdAsync(
                appUserId,
                projectId
            );
        appUserProject.ThrowExceptionIfNull(new HubException("User is not apart of this project"));

        var locations = command.Request.Panels.Select(x => x.Location).ToList();
        var existingPanels = await _unitOfWork.PanelsRepository.ArePanelLocationsUniqueAsync(
            projectId,
            locations
        );
        if (existingPanels)
            throw new HubException("Panel already exists at this location");

        var panelStringId = command.Request.StringId;
        var panelHasString = panelStringId.Equals("undefined") is false;

        var panelString = panelHasString
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

        panelString.ThrowExceptionIfNull(new HubException("String does not exist"));

        var panelConfigId = command.Request.PanelConfigId;
        var doesPanelHaveConfig = panelConfigId.Equals("undefined") is false;

        var panelConfig = doesPanelHaveConfig is false
            ? await _unitOfWork.PanelConfigsRepository.GetDefaultPanelConfigAsync()
            : await _unitOfWork.PanelConfigsRepository.GetByIdAsync(panelConfigId.ToGuid());

        panelConfig.ThrowExceptionIfNull(new HubException("Panel config does not exist"));

        var panels = command.Request.Panels.Select(
            x =>
                Panel.Create(
                    x.Id.ToGuid(),
                    appUserProject.ProjectId,
                    panelString.Id,
                    panelConfig.Id,
                    x.Location,
                    command.Request.Rotation,
                    appUserId
                )
        );

        panels = await _unitOfWork.PanelsRepository.AddManyAndSaveChangesAsync(panels);
        // var panelDtos4 = panels.ToDtoIEnumerable<Panel, PanelDto>();
        var projectMembers =
            await _unitOfWork.AppUserProjectsRepository.GetProjectMemberIdsByProjectId(
                appUserProject.ProjectId
            );
        /*var response = panels.ToProjectEventResponseV3(
            command,
            ActionType.CreateMany,
            projectId.ToString()
        );*/
        var response = panels.ToProjectEventResponseFromEntityList(command, ActionType.CreateMany);
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