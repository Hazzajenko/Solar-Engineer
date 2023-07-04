using Mediator;
using Microsoft.AspNetCore.SignalR;
using Projects.Application.Data.UnitOfWork;
using Projects.Contracts.Data;
using Projects.Contracts.Responses.Projects;
using Projects.Domain.Entities;
using Projects.SignalR.Hubs;
using Projects.SignalR.Queries.Projects;

namespace Projects.Application.Handlers.Projects;

public class GetUserProjectsHandler : IQueryHandler<GetUserProjectsQuery, IEnumerable<ProjectDto>>
{
    private readonly IHubContext<ProjectsHub, IProjectsHub> _hubContext;
    private readonly ILogger<GetUserProjectsHandler> _logger;
    private readonly IProjectsUnitOfWork _unitOfWork;

    public GetUserProjectsHandler(
        ILogger<GetUserProjectsHandler> logger,
        IProjectsUnitOfWork unitOfWork,
        IHubContext<ProjectsHub, IProjectsHub> hubContext
    )
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
        _hubContext = hubContext;
    }

    public async ValueTask<IEnumerable<ProjectDto>> Handle(
        GetUserProjectsQuery query,
        CancellationToken cT
    )
    {
        Guid appUserId = query.User.Id;

        ProjectUser? projectUser = await _unitOfWork.ProjectUsersRepository.GetByIdAsync(appUserId);
        projectUser.ThrowHubExceptionIfNull($"{appUserId.ToString()} project user not found");

        var selectedProjectId = projectUser.SelectedProjectId;

        var projects =
            await _unitOfWork.AppUserProjectsRepository.GetProjectsWithMembersByAppUserIdAsync(
                appUserId
            );

        var getManyProjectsResponse = new GetManyProjectsResponse
        {
            Projects = projects,
            SelectedProjectId = selectedProjectId.ToString()
        };

        await _hubContext.Clients
            .User(appUserId.ToString())
            .GetManyProjects(getManyProjectsResponse);
        _logger.LogInformation("User {User} get projects", query.User.ToAuthUserLog());

        return projects;
    }
}
