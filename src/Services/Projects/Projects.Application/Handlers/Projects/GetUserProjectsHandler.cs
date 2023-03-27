using Mediator;
using Microsoft.AspNetCore.SignalR;
using Projects.Application.Data.UnitOfWork;
using Projects.Domain.Contracts.Data;
using Projects.Domain.Queries.Projects;
using Projects.SignalR.Hubs;

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
        /*var projects = await _unitOfWork.AppUserProjectsRepository.GetProjectsByAppUserIdAsync(
            appUserId
        );*/
        var projects =
            await _unitOfWork.AppUserProjectsRepository.GetProjectsWithMembersByAppUserIdAsync(
                appUserId
            );

        /*var projectMembers = await _unitOfWork.AppUserProjectsRepository.GetProjectsByAppUserIdAsync(
            appUserId
        );*/

        // await _unitOfWork.AppUserProjectsRepository.

        // _logger.LogInformation("User {User} get user projects", appUserId);

        // _logger.LogInformation("User Identifier {User}", request.Context.UserIdentifier);

        // await _hubContext.Clients.Client(request.User.ConnectionId).GetManyProjects(projects);
        await _hubContext.Clients.User(appUserId.ToString()).GetManyProjects(projects);

        _logger.LogInformation("User {User} get projects", appUserId.ToString());

        return projects;
    }
}