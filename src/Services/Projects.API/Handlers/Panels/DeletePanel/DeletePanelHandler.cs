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

namespace Projects.API.Handlers.Panels.DeletePanel;

public class DeletePanelHandler : ICommandHandler<DeletePanelCommand, bool>
{
    private readonly IHubContext<ProjectsHub, IProjectsHub> _hubContext;
    private readonly ILogger<DeletePanelHandler> _logger;
    private readonly IMapper _mapper;
    private readonly IProjectsUnitOfWork _unitOfWork;

    public DeletePanelHandler(
        ILogger<DeletePanelHandler> logger,
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

    public async ValueTask<bool> Handle(DeletePanelCommand command, CancellationToken cT)
    {
        var appUserId = command.User.Id;
        var projectId = command.ProjectId.ToGuid();
        var appUserProject =
            await _unitOfWork.AppUserProjectsRepository.GetByAppUserIdAndProjectIdAsync(
                appUserId,
                projectId
            );
        appUserProject.ThrowExceptionIfNull(new HubException("User is not apart of this project"));

        var panelId = command.Request.Id.ToGuid();
        var deleteResult = await _unitOfWork.PanelsRepository.DeletePanelByIdAndProjectIdAsync(
            panelId,
            projectId
        );
        if (!deleteResult)
            throw new HubException("Panel not found");

        var panelIdString = panelId.ToString();
        var response = panelIdString.ToProjectEventResponseWithStringV3(
            command,
            ActionType.Delete,
            projectId.ToString(),
            typeof(Panel)
        );

        var projectMembers =
            await _unitOfWork.AppUserProjectsRepository.GetProjectMemberIdsByProjectId(
                appUserProject.ProjectId
            );

        await _hubContext.Clients.Users(projectMembers).ReceiveProjectEvent(response);

        _logger.LogInformation(
            "User {User} deleted panel {Panel} in project {Project}",
            appUserId.ToString(),
            panelIdString,
            appUserProject.Project.Id.ToString()
        );

        return true;
    }
}