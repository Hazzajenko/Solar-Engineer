using Infrastructure.Extensions;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Projects.API.Contracts.Data;
using Projects.API.Data;
using Projects.API.Hubs;

namespace Projects.API.Handlers.SignalR;

public sealed record GetProjectsQuery(HubCallerContext Context) : IRequest<IEnumerable<ProjectDto>>;

public class GetProjectsHandler : IRequestHandler<GetProjectsQuery, IEnumerable<ProjectDto>>
{
    private readonly IHubContext<ProjectsHub, IProjectsHub> _hubContext;
    private readonly ILogger<GetProjectsHandler> _logger;
    private readonly IProjectsUnitOfWork _unitOfWork;

    public GetProjectsHandler(
        ILogger<GetProjectsHandler> logger,
        IProjectsUnitOfWork unitOfWork,
        IHubContext<ProjectsHub, IProjectsHub> hubContext
    )
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
        _hubContext = hubContext;
    }

    public async ValueTask<IEnumerable<ProjectDto>> Handle(
        GetProjectsQuery request,
        CancellationToken cT
    )
    {
        ArgumentNullException.ThrowIfNull(request.Context.User);
        var appUserId = request.Context.User.GetGuidUserId();
        var projects = await _unitOfWork.AppUserProjectsRepository.GetProjectsByAppUserIdAsync(
            appUserId
        );

        // _logger.LogInformation("User {User} get user projects", appUserId);

        // _logger.LogInformation("User Identifier {User}", request.Context.UserIdentifier);

        await _hubContext.Clients.Client(request.Context.ConnectionId).GetManyProjects(projects);
        // await _hubContext.Clients.User(appUserId.ToString()).GetProjects(projects);

        _logger.LogInformation("User {User} get projects", appUserId.ToString());

        return projects;
    }
}