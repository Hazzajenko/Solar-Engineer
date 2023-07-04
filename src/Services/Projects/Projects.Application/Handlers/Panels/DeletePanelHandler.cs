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

        var panelId = command.Request.PanelId.ToGuid();
        var deleteResult = await _unitOfWork.PanelsRepository.DeletePanelByIdAndProjectIdAsync(
            panelId,
            projectId
        );
        if (!deleteResult)
            throw new HubException("Panel not found");

        var panelIdString = panelId.ToString();
        var response = panelIdString.ToProjectEventResponseFromId<Panel>(
            command,
            ActionType.Delete
        );

        var projectMembers =
            await _unitOfWork.AppUserProjectsRepository.GetProjectMemberIdsByProjectId(
                appUserProject.ProjectId
            );

        await _hubContext.Clients.Users(projectMembers).ReceiveProjectEvent(response);

        _logger.LogInformation(
            "User {User} deleted panel {Panel} in project {Project}",
            command.User.ToAuthUserLog(),
            panelIdString,
            appUserProject.Project.Id.ToString()
        );

        return true;
    }
}
