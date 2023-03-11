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

        /*foreach (var panel in command.Request.Panels)
        {
            var existingPanel = await _unitOfWork.PanelsRepository.GetPanelByLocationAsync(
                appUserId,
                projectId,
                panel.Location
            );
            if (existingPanel is not null)
                throw new HubException("Panel already exists at this location");
        }*/

        /*
        var existingPanel = await _unitOfWork.PanelsRepository.GetPanelByLocationAsync(
            appUserId,
            projectId,
            command.Request.Location
        );*/

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
        var response = panels.ToProjectEventResponseV3(
            command,
            ActionType.Create,
            projectId.ToString()
        );
        // var response = panelDtos4.ToProjectEventResponseV3(command, ActionType.Create, projectId.ToString());
        await _hubContext.Clients.Users(projectMembers).ReceiveProjectEvent(response);

        /*panelDtos4.DumpObjectJson();
        var panelDtos = _mapper.Map<IEnumerable<Panel>, IEnumerable<PanelDto>>(panels);
        panelDtos.DumpObjectJson();
        var panelDtos2 = panels.Adapt<IEnumerable<PanelDto>>();
        panelDtos2.DumpObjectJson();*/
        /*var response = _mapper.Map<(Panel, string), ProjectEventResponse>(
            (panel, command.RequestId)
        );*/
        // var response = panel.ToProjectEventResponseV2(command, ActionType.Create, ModelType.Panel);
        /*var response = panel.ToProjectEventResponseV3(command, ActionType.Create);
        // _logger.LogInformation("Panel created: {@Panel}", panel);
        // _logger.LogInformation("Panel created response: {@Response}", response);
        // var response = _mapper.Map<(Panel, string), PanelCreatedResponse>((panel, command.Request.RequestId));

        var projectMembers =
            await _unitOfWork.AppUserProjectsRepository.GetProjectMemberIdsByProjectId(
                appUserProject.ProjectId
            );

        /*await _hubContext.Clients
            .Group(appUserProject.ProjectId.ToString())
            .NewProjectEvents(response.ToIEnumerable());#1#
        /*await _hubContext.Clients
            .Group(appUserProject.ProjectId.ToString())
            .ReceiveProjectEvents(response.ToIEnumerable());#1#
        /*await _hubContext.Clients
            .Group(appUserProject.ProjectId.ToString())
            .PanelsCreated(response.ToIEnumerable());#1#

        /*await _hubContext.Clients
            .Group(appUserProject.ProjectId.ToString())
            .PanelsCreated(panel.ToDtoList());#1#
        /*await _hubContext.Clients
            .Users(projectMembers)
            .ReceiveProjectEvents(response.ToIEnumerable());#1#
        await _hubContext.Clients.Users(projectMembers).ReceiveProjectEvent(response);
        // await _hubContext.Clients.Users(projectMembers).NewProjectEvents(response.ToIEnumerable());
        // await _hubContext.Clients.Users(projectMembers).PanelsCreated(response.ToIEnumerable());
        // await _hubContext.Clients.Users(projectMembers).PanelsCreated(panel.ToDtoList());

        _logger.LogInformation(
            "User {User} created panel {Panel} in project {Project}",
            appUserId.ToString(),
            panel.Id.ToString(),
            appUserProject.Project.Id.ToString()
        );*/

        _logger.LogInformation(
            "User {User} created {Amount} panels in project {Project}",
            appUserId.ToString(),
            panels.Count(),
            appUserProject.Project.Id.ToString()
        );

        return true;
    }
}