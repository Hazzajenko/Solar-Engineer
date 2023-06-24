using ApplicationCore.Exceptions;
using ApplicationCore.Extensions;
using Infrastructure.Extensions;
using MapsterMapper;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Projects.Application.Data.UnitOfWork;
using Projects.Application.Mapping;
using Projects.Domain.Common;
using Projects.Domain.Entities;
using Projects.SignalR.Commands.Panels;
using Projects.SignalR.Hubs;

namespace Projects.Application.Handlers.Panels;

public class CreatePanelHandler : ICommandHandler<CreatePanelCommand, bool>
{
    // private const string DefaultPanelConfigId = "Longi-Himo555m";
    // private const string UndefinedStringId = "UNDEFINED_STRING_ID";
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

        var panelStringId = command.Request.Panel.StringId;
        var panelHasString = panelStringId.Equals(String.UndefinedStringId) is false;

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

        var panelConfigId = command.Request.Panel.PanelConfigId;
        var panelConfig = panelConfigId.Equals(PanelConfig.DefaultPanelConfigId)
            ? await _unitOfWork.PanelConfigsRepository.GetByBrandAndModelAsync("Longi", "Himo555m")
            : await _unitOfWork.PanelConfigsRepository.GetByIdAsync(panelConfigId.ToGuid());

        panelConfig.ThrowExceptionIfNull(new HubException("Panel config does not exist"));

        var panel = Panel.Create(
            command.Request.Panel.Id.ToGuid(),
            appUserProject.ProjectId,
            panelString.Id,
            panelConfig.Id,
            command.Request.Panel.Location,
            command.Request.Panel.Angle,
            appUserId
        );

        await _unitOfWork.PanelsRepository.AddAsync(panel);
        await _unitOfWork.SaveChangesAsync();
        
        panel = await _unitOfWork.PanelsRepository.GetByIdAsync(panel.Id);
        panel.ThrowExceptionIfNull(new HubException("Panel does not exist"));

        var response = panel.ToProjectEventResponseFromEntity(command, ActionType.Create);

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