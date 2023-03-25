using Infrastructure.Exceptions;
using Infrastructure.Extensions;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Projects.Application.Data.UnitOfWork;
using Projects.Domain.Contracts.Data;
using Projects.Domain.Queries.Projects;
using Projects.SignalR.Hubs;

namespace Projects.Application.Handlers.Projects;

public class GetProjectByIdHandler : IQueryHandler<GetProjectByIdQuery, bool>
{
    private readonly IHubContext<ProjectsHub, IProjectsHub> _hubContext;
    private readonly ILogger<GetProjectByIdHandler> _logger;
    private readonly IProjectsUnitOfWork _unitOfWork;

    public GetProjectByIdHandler(
        ILogger<GetProjectByIdHandler> logger,
        IProjectsUnitOfWork unitOfWork,
        IHubContext<ProjectsHub, IProjectsHub> hubContext
    )
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
        _hubContext = hubContext;
    }

    public async ValueTask<bool> Handle(GetProjectByIdQuery request, CancellationToken cT)
    {
        var appUserIdGuid = request.User.Id;
        var projectIdGuid = request.ProjectId.ToGuid();
        var project =
            await _unitOfWork.AppUserProjectsRepository.GetProjectByAppUserAndProjectIdAsync(
                appUserIdGuid,
                projectIdGuid
            );

        project.ThrowExceptionIfNull(new HubException("User is not apart of this project"));

        var strings = await _unitOfWork.StringsRepository.GetStringsByProjectIdAsync(projectIdGuid);
        var panels = await _unitOfWork.PanelsRepository.GetPanelsByProjectIdAsync(projectIdGuid);
        var panelLinks = await _unitOfWork.PanelLinksRepository.GetPanelLinksByProjectIdAsync(
            projectIdGuid
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

        await _hubContext.Clients.User(request.User.Id.ToString()).GetProject(response);
        /*// await _hubContext.Clients.Client(request.User.ConnectionId).GetProject(response);*/

        _logger.LogInformation(
            "User {User} get project data {Project}",
            appUserIdGuid.ToString(),
            projectIdGuid.ToString()
        );

        return true;
    }
}