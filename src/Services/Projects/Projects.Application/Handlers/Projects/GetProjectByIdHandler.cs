using ApplicationCore.Exceptions;
using ApplicationCore.Extensions;
using Infrastructure.Extensions;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Projects.Application.Data.UnitOfWork;
using Projects.Contracts.Data;
using Projects.Contracts.Responses.Projects;
using Projects.Domain.Entities;
using Projects.SignalR.Hubs;
using Projects.SignalR.Queries.Projects;

namespace Projects.Application.Handlers.Projects;

public class GetProjectByIdHandler : IQueryHandler<GetProjectByIdQuery, GetProjectByIdResponse>
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

    public async ValueTask<GetProjectByIdResponse> Handle(
        GetProjectByIdQuery query,
        CancellationToken cT
    )
    {
        Guid appUserIdGuid = query.User.Id;
        var projectIdGuid = query.ProjectId.ToGuid();
        ProjectDto? project =
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

        var panelConfigDtos =
            await _unitOfWork.PanelConfigsRepository.GetDefaultPanelConfigDtosAsync();

        var projectDataDto = new ProjectDataDto
        {
            Name = project.Name,
            Id = project.Id,
            CreatedTime = project.CreatedTime,
            LastModifiedTime = project.LastModifiedTime,
            CreatedById = project.CreatedById,
            Strings = strings,
            Panels = panels,
            PanelLinks = panelLinks,
            PanelConfigs = panelConfigDtos,
            Colour = project.Colour,
            MemberIds = project.MemberIds,
            Members = project.Members,
            UndefinedStringId = project.UndefinedStringId,
        };

        var response = new GetProjectByIdResponse { Project = projectDataDto };

        ProjectUser? projectUser = await _unitOfWork.ProjectUsersRepository.GetByIdAsync(
            appUserIdGuid
        );
        ArgumentNullException.ThrowIfNull(projectUser, nameof(projectUser));
        projectUser.SelectedProjectId = projectIdGuid;
        await _unitOfWork.ProjectUsersRepository.UpdateAsync(projectUser);
        await _unitOfWork.SaveChangesAsync();

        _logger.LogDebug(
            "User {UserName}: Get Project Data {ProjectId}",
            query.User.UserName,
            projectIdGuid
        );

        return response;
    }
}
