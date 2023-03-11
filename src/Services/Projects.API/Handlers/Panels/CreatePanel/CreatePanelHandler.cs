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
        appUserProject.ThrowExceptionIfNull(new HubException("User is not apart of this project"));

        var existingPanel = await _unitOfWork.PanelsRepository.ArePanelLocationsUniqueAsync(
            projectId,
            new[] { command.Request.Location }
        );
        if (existingPanel)
            throw new HubException("Panel already exists at this location");

        /*var existingPanel = await _unitOfWork.PanelsRepository.GetPanelByLocationAsync(
            appUserId,
            projectId,
            command.Request.Location
        );
        if (existingPanel is not null) throw new HubException("Panel already exists at this location");*/

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

        var panel = Panel.Create(
            command.Request.Id.ToGuid(),
            appUserProject.ProjectId,
            panelString.Id,
            panelConfig.Id,
            command.Request.Location,
            command.Request.Rotation,
            appUserId
        );

        panel = await _unitOfWork.PanelsRepository.AddAndSaveChangesAsync(panel);

        var response = panel.ToProjectEventResponseV3(command, ActionType.Create);

        var projectMembers =
            await _unitOfWork.AppUserProjectsRepository.GetProjectMemberIdsByProjectId(
                appUserProject.ProjectId
            );

        await _hubContext.Clients.Users(projectMembers).ReceiveProjectEvent(response);

        _logger.LogInformation(
            "User {User} created panel {Panel} in project {Project}",
            appUserId.ToString(),
            panel.Id.ToString(),
            appUserProject.Project.Id.ToString()
        );

        return true;
    }
}