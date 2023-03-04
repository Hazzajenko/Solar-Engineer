using Infrastructure.Extensions;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Projects.API.Data;
using Projects.API.Hubs;

namespace Projects.API.Handlers.SignalR;

public sealed record OnConnectedAsyncCommand(HubCallerContext Context) : IRequest<bool>;

public class OnConnectedAsyncHandler : IRequestHandler<OnConnectedAsyncCommand, bool>
{
    private readonly IHubContext<ProjectsHub, IProjectsHub> _hubContext;
    private readonly ILogger<OnConnectedAsyncHandler> _logger;
    private readonly IProjectsUnitOfWork _unitOfWork;

    public OnConnectedAsyncHandler(
        ILogger<OnConnectedAsyncHandler> logger,
        IProjectsUnitOfWork unitOfWork,
        IHubContext<ProjectsHub, IProjectsHub> hubContext
    )
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
        _hubContext = hubContext;
    }

    public async ValueTask<bool> Handle(OnConnectedAsyncCommand request, CancellationToken cT)
    {
        ArgumentNullException.ThrowIfNull(request.Context.User);
        var appUserId = request.Context.User.GetGuidUserId();

        _logger.LogInformation("User {User} connected to projects hub", appUserId.ToString());
        
        var projects = await _unitOfWork.AppUserProjectsRepository.GetProjectsByAppUserIdAsync(
            appUserId
        );

        await _hubContext.Clients.Client(request.Context.ConnectionId).GetProjects(projects);
        // await _hubContext.Clients.User(appUserId.ToString()).GetProjects(projects);


        _logger.LogInformation(
            "User {User} get projects",
            appUserId.ToString()
        );

        return true;
    }
}