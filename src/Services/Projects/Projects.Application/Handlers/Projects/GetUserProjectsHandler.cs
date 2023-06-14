using Mediator;
using Microsoft.AspNetCore.SignalR;
using Projects.Application.Data.UnitOfWork;
using Projects.Contracts.Data;
using Projects.Contracts.Responses.Projects;
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
        GetUserProjectsQuery request,
        CancellationToken cT
    )
    {
        var appUserId = request.User.Id;
        var projects =
            await _unitOfWork.AppUserProjectsRepository.GetProjectsWithMembersByAppUserIdAsync(
                appUserId
            );

        var getManyProjectsResponse = new GetManyProjectsResponse
        {
            Projects = projects
        };

        await _hubContext.Clients.User(appUserId.ToString()).GetManyProjects(getManyProjectsResponse);
        _logger.LogInformation("User {User} get projects", appUserId.ToString());

        return projects;
    }
}
