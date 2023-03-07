using Infrastructure.Exceptions;
using Infrastructure.Extensions;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Projects.API.Contracts.Data;
using Projects.API.Data;
using Projects.API.Hubs;

namespace Projects.API.Handlers.Projects.GetProject;

public class GetProjectHandler : IQueryHandler<GetProjectQuery, bool>
{
    private readonly IHubContext<ProjectsHub, IProjectsHub> _hubContext;
    private readonly ILogger<GetProjectHandler> _logger;
    private readonly IProjectsUnitOfWork _unitOfWork;

    public GetProjectHandler(
        ILogger<GetProjectHandler> logger,
        IProjectsUnitOfWork unitOfWork,
        IHubContext<ProjectsHub, IProjectsHub> hubContext
    )
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
        _hubContext = hubContext;
    }

    public async ValueTask<bool> Handle(GetProjectQuery request, CancellationToken cT)
    {
        _logger.LogInformation(
            "User {User} requested project {Project}",
            request.User.ToString(),
            request.ProjectId
        );
        var appUserId = request.User.Id;
        var projectId = request.ProjectId.TryToGuid(new HubException("Invalid project id"));
        var project =
            await _unitOfWork.AppUserProjectsRepository.GetProjectByAppUserAndProjectIdAsync(
                appUserId,
                projectId
            );

        project.ThrowExceptionIfNull(new HubException("User is not apart of this project"));


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

        // await _hubContext.Clients.User(request.User.Id.ToString()).GetProjectData(response);
        await _hubContext.Clients.Client(request.User.ConnectionId).GetProject(response);

        _logger.LogInformation(
            "User {User} get project data {Project}",
            appUserId.ToString(),
            projectId.ToString()
        );

        return true;
    }
}