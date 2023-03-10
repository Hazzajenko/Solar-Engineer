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

namespace Projects.API.Handlers.Panels.CreatePanel;

/*public sealed record CreatePanelCommand(
    HubCallerContext Context,
    CreatePanelRequest CreatePanelRequest
) : IRequest<bool>;*/

public class CreatePanelHandler : ICommandHandler<CreatePanelCommand, bool>
{
    private readonly IHubContext<ProjectsHub, IProjectsHub> _hubContext;
    private readonly ILogger<CreatePanelHandler> _logger;
    private readonly IMapper _mapper;
    private readonly IProjectsUnitOfWork _unitOfWork;

    public CreatePanelHandler(
        ILogger<CreatePanelHandler> logger,
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

    public async ValueTask<bool> Handle(CreatePanelCommand command, CancellationToken cT)
    {
        var appUserId = command.User.Id;
        var projectId = command.Request.ProjectId.ToGuid();
        var appUserProject =
            await _unitOfWork.AppUserProjectsRepository.GetByAppUserIdAndProjectIdAsync(
                appUserId,
                projectId
            );

        /*
        ThrowHubExceptionIfNull(
            appUserProject,
            "User is not apart of this project"
        );*/

        var panelStringId = command.Request.StringId;
        var panelHasString = panelStringId.Equals("undefined") is false;

        var panelString = panelHasString
            ? await _unitOfWork.StringsRepository.GetByIdAndProjectIdAsync(
                panelStringId.ToGuid(),
                projectId
            )
            : await _unitOfWork.StringsRepository.GetUndefinedStringByProjectIdAsync(projectId);
        /*String? panelString;
        if (panelHasString)
            panelString = await _unitOfWork.StringsRepository.GetByIdAndProjectIdAsync(
                panelStringId.ToGuid(),
                projectId
            );
        else
            panelString = await _unitOfWork.StringsRepository.GetUndefinedStringByProjectIdAsync(
                projectId
            );*/

        var projectDoesNotHaveUndefinedString = panelString is null && !panelHasString;

        if (projectDoesNotHaveUndefinedString)
        {
            panelString = String.CreateUndefined(projectId, appUserId);

            await _unitOfWork.StringsRepository.AddAsync(panelString);
            await _unitOfWork.SaveChangesAsync();
        }

        // ThrowHubExceptionIfNull(panelString, "String does not exist");
        panelString.ThrowExceptionIfNull(new HubException("String does not exist"));

        var panelConfigId = command.Request.PanelConfigId;
        var doesPanelHaveConfig = panelConfigId.Equals("undefined") is false;

        /*PanelConfig? panelConfig;
        if (doesPanelHaveConfig)
        {
            panelConfig = await _unitOfWork.PanelConfigsRepository.GetByIdAsync(
                panelConfigId.ToGuid()
            );
        }
        else
        {
            panelConfig = await _unitOfWork.PanelConfigsRepository.GetDefaultPanelConfigAsync();
        }*/

        // panelconfig = switch (doesPanelHaveConfig)
        /*switch (doesPanelHaveConfig)
        {
            case true:
                panelConfig = await _unitOfWork.PanelConfigsRepository.GetByIdAsync(
                    panelConfigId.ToGuid()
                );
                break;
            case false:
                panelConfig = await _unitOfWork.PanelConfigsRepository.GetDefaultPanelConfigAsync();
                break;
        }*/


        /*panelConfig = switch (doesPanelHaveConfig)
        {
                true: await _unitOfWork.PanelConfigsRepository.GetByIdAsync(
                    panelConfigId.ToGuid()
                );
                panelConfig = await _unitOfWork.PanelConfigsRepository.GetByIdAsync(
                    panelConfigId.ToGuid()
                );
                break;
            false:
                panelConfig = await _unitOfWork.PanelConfigsRepository.GetDefaultPanelConfigAsync();
                break;
            
        }*/

        var panelConfig = doesPanelHaveConfig is false
            ? await _unitOfWork.PanelConfigsRepository.GetDefaultPanelConfigAsync()
            : await _unitOfWork.PanelConfigsRepository.GetByIdAsync(panelConfigId.ToGuid());
        // panelConfig = ThrowHubExceptionIfNull(panelConfig, "Panel config does not exist");
        panelConfig.ThrowExceptionIfNull(new HubException("Panel config does not exist"));
        // ThrowHubExceptionIfNull(panelConfig, "Panel config does not exist");

        /*var panel = request.CreatePanelRequest.ToDomain(
            appUserProject.ProjectId,
            panelString.Id,
            panelConfig.Id
        );*/
        /*var panel = new Panel
        {
            Id = command.Panel.Id.ToGuid(),
            StringId = panelString.Id,
            PanelConfigId = panelConfig.Id,
            ProjectId = appUserProject.ProjectId,
            Location = command.Panel.Location,
            Rotation = command.Panel.Rotation
        };*/
        var panel = Panel.Create(
            command.Request.Id.ToGuid(),
            appUserProject.ProjectId,
            panelString.Id,
            panelConfig.Id,
            command.Request.Location,
            command.Request.Rotation,
            appUserId
        );
        // var panel = Panel.Create(command.Panel.Id.ToG, panelString.Id, panelConfig.Id, appUserProject.ProjectId);
        // await _unitOfWork.PanelsRepository.AddAsync(panel);
        // await _unitOfWork.SaveChangesAsync();
        /*var response = await _unitOfWork.PanelsRepository.CreatePanelAsync<PanelCreatedResponse>(
            panel
        );*/
        panel = await _unitOfWork.PanelsRepository.AddAndSaveChangesAsync(panel);
        /*var response = _mapper.Map<(Panel, string), ProjectEventResponse>(
            (panel, command.RequestId)
        );*/
        // var response = panel.ToProjectEventResponseV2(command, ActionType.Create, ModelType.Panel);
        var response = panel.ToProjectEventResponseV3(command, ActionType.Create);
        // _logger.LogInformation("Panel created: {@Panel}", panel);
        // _logger.LogInformation("Panel created response: {@Response}", response);
        // var response = _mapper.Map<(Panel, string), PanelCreatedResponse>((panel, command.Request.RequestId));

        var projectMembers =
            await _unitOfWork.AppUserProjectsRepository.GetProjectMemberIdsByProjectId(
                appUserProject.ProjectId
            );

        /*await _hubContext.Clients
            .Group(appUserProject.ProjectId.ToString())
            .NewProjectEvents(response.ToIEnumerable());*/
        /*await _hubContext.Clients
            .Group(appUserProject.ProjectId.ToString())
            .ReceiveProjectEvents(response.ToIEnumerable());*/
        /*await _hubContext.Clients
            .Group(appUserProject.ProjectId.ToString())
            .PanelsCreated(response.ToIEnumerable());*/

        /*await _hubContext.Clients
            .Group(appUserProject.ProjectId.ToString())
            .PanelsCreated(panel.ToDtoList());*/
        /*await _hubContext.Clients
            .Users(projectMembers)
            .ReceiveProjectEvents(response.ToIEnumerable());*/
        await _hubContext.Clients.Users(projectMembers).ReceiveProjectEvent(response);
        // await _hubContext.Clients.Users(projectMembers).NewProjectEvents(response.ToIEnumerable());
        // await _hubContext.Clients.Users(projectMembers).PanelsCreated(response.ToIEnumerable());
        // await _hubContext.Clients.Users(projectMembers).PanelsCreated(panel.ToDtoList());

        _logger.LogInformation(
            "User {User} created panel {Panel} in project {Project}",
            appUserId.ToString(),
            panel.Id.ToString(),
            appUserProject.Project.Id.ToString()
        );

        return true;
    }
}