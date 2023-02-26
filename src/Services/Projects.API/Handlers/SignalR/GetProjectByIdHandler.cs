using Infrastructure.Extensions;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Projects.API.Data;
using Projects.API.Hubs;

namespace Projects.API.Handlers.SignalR;

public sealed record GetProjectByIdQuery
    (HubCallerContext Context, string ProjectId) : IRequest<bool>;

public class
    GetProjectByIdHandler : IRequestHandler<GetProjectByIdQuery, bool>
{
    private readonly IHubContext<ProjectsHub, IProjectsHub> _hubContext;
    private readonly ILogger<GetProjectByIdHandler> _logger;
    private readonly IProjectsUnitOfWork _unitOfWork;

    public GetProjectByIdHandler(ILogger<GetProjectByIdHandler> logger, IProjectsUnitOfWork unitOfWork,
        IHubContext<ProjectsHub, IProjectsHub> hubContext)
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
        _hubContext = hubContext;
    }

    public async ValueTask<bool>
        Handle(GetProjectByIdQuery request, CancellationToken cT)
    {
        ArgumentNullException.ThrowIfNull(request.Context.User);
        var appUserId = request.Context.User.GetGuidUserId();
        var projectId = request.ProjectId.ToGuid();
        var project =
            await _unitOfWork.AppUserProjectsRepository.GetProjectByAppUserAndProjectIdAsync(appUserId, projectId);

        if (project is null)
        {
            _logger.LogError("User {User} tried to get project {Project}, NULL", appUserId.ToString(),
                projectId.ToString());
            throw new HubException("User is not apart of this project");
        }

        await _hubContext.Clients.User(appUserId.ToString()).GetUserProject(project);

        _logger.LogInformation("User {User} get project {Project}", appUserId.ToString(), projectId.ToString());

        return true;
    }
}