using Infrastructure.Extensions;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Projects.API.Contracts.Requests.Panels;
using Projects.API.Data;
using Projects.API.Hubs;
using Projects.API.Mapping;
using Projects.API.Services.Strings;

namespace Projects.API.Handlers.SignalR.Panels;

public sealed record CreatePanelCommand(
    HubCallerContext Context,
    CreatePanelRequest CreatePanelRequest
) : IRequest<bool>;

public class CreatePanelHandler : IRequestHandler<CreatePanelCommand, bool>
{
    private readonly IHubContext<ProjectsHub, IProjectsHub> _hubContext;
    private readonly ILogger _logger;
    private readonly IMediator _mediator;
    private readonly IStringsService _stringsService;
    private readonly IProjectsUnitOfWork _unitOfWork;

    public CreatePanelHandler(
        ILogger<CreatePanelHandler> logger,
        IProjectsUnitOfWork unitOfWork,
        IHubContext<ProjectsHub, IProjectsHub> hubContext,
        IStringsService stringsService,
        IMediator mediator
    )
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
        _hubContext = hubContext;
        _stringsService = stringsService;
        _mediator = mediator;
    }

    public async ValueTask<bool> Handle(CreatePanelCommand request, CancellationToken cT)
    {
        var user = ThrowHubExceptionIfNull(request.Context.User, "User is null");
        var appUserId = user.GetGuidUserId();
        var projectId = request.CreatePanelRequest.ProjectId.ToGuid();
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

        var panelStringId = request.CreatePanelRequest.StringId;
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

        ThrowHubExceptionIfNull(panelString, "String does not exist");

        var panelConfigId = request.CreatePanelRequest.PanelConfigId;
        var doesPanelHaveConfig = panelConfigId.Equals("undefined") is false;

        var panelConfig = doesPanelHaveConfig is false
            ? await _unitOfWork.PanelConfigsRepository.GetDefaultPanelConfigAsync()
            : await _unitOfWork.PanelConfigsRepository.GetByIdAsync(panelConfigId.ToGuid());
        // panelConfig = ThrowHubExceptionIfNull(panelConfig, "Panel config does not exist");
        ThrowHubExceptionIfNull(panelConfig, "Panel config does not exist");

        var panel = request.CreatePanelRequest.ToDomain(
            appUserProject.ProjectId,
            panelString.Id,
            panelConfig.Id
        );
        await _unitOfWork.PanelsRepository.AddAsync(panel);
        await _unitOfWork.SaveChangesAsync();

        var projectMembers =
            await _unitOfWork.AppUserProjectsRepository.GetProjectMemberIdsByProjectId(
                appUserProject.ProjectId
            );

        await _hubContext.Clients
            .Group(appUserProject.ProjectId.ToString())
            .PanelsCreated(panel.ToDtoList());
        await _hubContext.Clients.Users(projectMembers).PanelsCreated(panel.ToDtoList());

        _logger.LogInformation(
            "User {User} created panel {Panel} in project {Project}",
            appUserId.ToString(),
            panel.Id.ToString(),
            appUserProject.Project.Name
        );

        return true;
    }
}