using Infrastructure.Exceptions;
using Infrastructure.Extensions;
using Infrastructure.Mapping;
using MapsterMapper;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Projects.API.Contracts.Responses;
using Projects.API.Data;
using Projects.API.Entities;
using Projects.API.Hubs;

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
        var appUserId = command.User.GetGuidUserId();
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

        var panelStringId = command.Request.Create.StringId;
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

        // ThrowHubExceptionIfNull(panelString, "String does not exist");
        panelString.ThrowExceptionIfNull(new HubException("String does not exist"));

        var panelConfigId = command.Request.Create.PanelConfigId;
        var doesPanelHaveConfig = panelConfigId.Equals("undefined") is false;

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
            command.Request.RequestId.ToGuid(),
            appUserProject.ProjectId,
            panelString.Id,
            panelConfig.Id,
            command.Request.Create.Location,
            command.Request.Create.Rotation,
            appUserId
        );
        // var panel = Panel.Create(command.Panel.Id.ToG, panelString.Id, panelConfig.Id, appUserProject.ProjectId);
        // await _unitOfWork.PanelsRepository.AddAsync(panel);
        // await _unitOfWork.SaveChangesAsync();
        /*var response = await _unitOfWork.PanelsRepository.CreatePanelAsync<PanelCreatedResponse>(
            panel
        );*/
        panel = await _unitOfWork.PanelsRepository.AddAndSaveChangesAsync(panel);
        var response = _mapper.Map<(Panel, string), ProjectEventResponse>(
            (panel, command.Request.RequestId)
        );
        // var response = _mapper.Map<(Panel, string), PanelCreatedResponse>((panel, command.Request.RequestId));

        var projectMembers =
            await _unitOfWork.AppUserProjectsRepository.GetProjectMemberIdsByProjectId(
                appUserProject.ProjectId
            );

        await _hubContext.Clients
            .Group(appUserProject.ProjectId.ToString())
            .NewProjectEvents(response.ToIEnumerable());
        /*await _hubContext.Clients
            .Group(appUserProject.ProjectId.ToString())
            .PanelsCreated(response.ToIEnumerable());*/

        /*await _hubContext.Clients
            .Group(appUserProject.ProjectId.ToString())
            .PanelsCreated(panel.ToDtoList());*/
        await _hubContext.Clients.Users(projectMembers).NewProjectEvents(response.ToIEnumerable());
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