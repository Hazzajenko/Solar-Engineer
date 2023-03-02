using Infrastructure.Extensions;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Projects.API.Contracts.Requests.Panels;
using Projects.API.Data;
using Projects.API.Hubs;
using Projects.API.Mapping;

namespace Projects.API.Handlers.SignalR.Panels;

public sealed record CreatePanelCommand(
    HubCallerContext Context,
    CreatePanelRequest CreatePanelRequest
) : IRequest<bool>;

public class CreatePanelHandler : IRequestHandler<CreatePanelCommand, bool>
{
    private readonly IHubContext<ProjectsHub, IProjectsHub> _hubContext;
    private readonly ILogger _logger;
    private readonly IProjectsUnitOfWork _unitOfWork;

    public CreatePanelHandler(
        ILogger<CreatePanelHandler> logger,
        IProjectsUnitOfWork unitOfWork,
        IHubContext<ProjectsHub, IProjectsHub> hubContext
    )
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
        _hubContext = hubContext;
    }

    public async ValueTask<bool> Handle(CreatePanelCommand request, CancellationToken cT)
    {
        ArgumentNullException.ThrowIfNull(request.Context.User);
        var appUserId = request.Context.User.GetGuidUserId();
        var project = await _unitOfWork.ProjectsRepository.GetByIdAsync(
            request.CreatePanelRequest.ProjectId.ToGuid()
        );
        if (project is null)
        {
            _logger.LogError(
                "User {User} tried to get project {Project}, null",
                appUserId.ToString(),
                request.CreatePanelRequest.ProjectId
            );
            throw new HubException("User is not apart of this project");
        }

        var panelString = await _unitOfWork.StringsRepository.GetByIdAsync(
            request.CreatePanelRequest.StringId.ToGuid()
        );
        if (panelString is null)
        {
            _logger.LogError(
                "User {User} tried to get string {String}, null",
                appUserId.ToString(),
                request.CreatePanelRequest.StringId
            );
            throw new HubException("String does not exist");
        }

        var panelConfig = await _unitOfWork.PanelConfigsRepository.GetByIdAsync(
            request.CreatePanelRequest.PanelConfigId.ToGuid()
        );
        if (panelConfig is null)
        {
            _logger.LogError(
                "User {User} tried to get panel config {PanelConfig}, null",
                appUserId.ToString(),
                request.CreatePanelRequest.PanelConfigId
            );
            throw new HubException("Panel config does not exist");
        }

        var panel = request.CreatePanelRequest.ToDomain(project.Id, panelString.Id, panelConfig.Id);
        await _unitOfWork.PanelsRepository.AddAsync(panel);
        await _unitOfWork.SaveChangesAsync();

        var projectMembers =
            await _unitOfWork.AppUserProjectsRepository.GetProjectMemberIdsByProjectId(project.Id);

        await _hubContext.Clients.Group(project.Id.ToString()).PanelsCreated(panel.ToDtoList());
        await _hubContext.Clients.Users(projectMembers).PanelsCreated(panel.ToDtoList());

        _logger.LogInformation(
            "User {User} created panel {Panel} in project {Project}",
            appUserId.ToString(),
            panel.Id.ToString(),
            project.Name
        );

        return true;
    }
}