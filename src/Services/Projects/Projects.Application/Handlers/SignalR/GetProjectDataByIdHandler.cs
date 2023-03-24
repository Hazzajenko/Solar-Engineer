using Infrastructure.Extensions;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Projects.Application.Data;
using Projects.Domain.Contracts.Data;
using Projects.SignalR.Hubs;

namespace Projects.Application.Handlers.SignalR;

public sealed record GetProjectDataByIdQuery(HubCallerContext Context, string ProjectId)
    : IRequest<bool>;

public class GetProjectDataByIdHandler : IRequestHandler<GetProjectDataByIdQuery, bool>
{
    private readonly IHubContext<ProjectsHub, IProjectsHub> _hubContext;
    private readonly ILogger<GetProjectDataByIdHandler> _logger;
    private readonly IProjectsUnitOfWork _unitOfWork;

    public GetProjectDataByIdHandler(
        ILogger<GetProjectDataByIdHandler> logger,
        IProjectsUnitOfWork unitOfWork,
        IHubContext<ProjectsHub, IProjectsHub> hubContext
    )
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
        _hubContext = hubContext;
    }

    public async ValueTask<bool> Handle(GetProjectDataByIdQuery request, CancellationToken cT)
    {
        ArgumentNullException.ThrowIfNull(request.Context.User);
        _logger.LogInformation(
            "User {User} requested project {Project}",
            request.Context.User.GetGuidUserId().ToString(),
            request.ProjectId
        );
        var appUserId = request.Context.User.GetGuidUserId();
        var projectId = request.ProjectId.ToGuid();
        var project =
            await _unitOfWork.AppUserProjectsRepository.GetProjectByAppUserAndProjectIdAsync(
                appUserId,
                projectId
            );

        if (project is null)
        {
            _logger.LogError(
                "User {User} tried to get project {Project}, NULL",
                appUserId.ToString(),
                projectId.ToString()
            );
            throw new HubException("User is not apart of this project");
        }

        var strings = await _unitOfWork.StringsRepository.GetStringsByProjectIdAsync(projectId);
        var panels = await _unitOfWork.PanelsRepository.GetPanelsByProjectIdAsync(projectId);
        var panelLinks = await _unitOfWork.PanelLinksRepository.GetPanelLinksByProjectIdAsync(
            projectId
        );

        var response = new ProjectDataDto
        {
            Name = project.Name,
            Id = project.Id,
            CreatedTime = project.CreatedTime,
            LastModifiedTime = project.LastModifiedTime,
            CreatedById = project.CreatedById,
            Strings = strings,
            Panels = panels,
            PanelLinks = panelLinks
        };

        // _hubContext.Clients.
        // await _hubContext.Clients.User(appUserId.ToString()).GetProjectData(response);
        await _hubContext.Clients.Client(request.Context.ConnectionId).GetProject(response);

        _logger.LogInformation(
            "User {User} get project data {Project}",
            appUserId.ToString(),
            projectId.ToString()
        );

        return true;
    }
}