using Mediator;
using Microsoft.AspNetCore.SignalR;
using Projects.API.Data;
using Projects.API.Hubs;

namespace Projects.API.Handlers.SignalR.OnConnected;

public class OnConnectedHandler : ICommandHandler<OnConnectedCommand, bool>
{
    private readonly IHubContext<ProjectsHub, IProjectsHub> _hubContext;
    private readonly ILogger<OnConnectedHandler> _logger;
    private readonly IProjectsUnitOfWork _unitOfWork;

    public OnConnectedHandler(
        ILogger<OnConnectedHandler> logger,
        IProjectsUnitOfWork unitOfWork,
        IHubContext<ProjectsHub, IProjectsHub> hubContext
    )
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
        _hubContext = hubContext;
    }

    public async ValueTask<bool> Handle(OnConnectedCommand request, CancellationToken cT)
    {
        var appUserId = request.User.Id;

        _logger.LogInformation("User {User} connected to projects hub", appUserId.ToString());

        /*var projects = await _unitOfWork.AppUserProjectsRepository.GetProjectsByAppUserIdAsync(
            appUserId
        );*/

        // await _hubContext.Clients.User(appUserId.ToString()).GetProjects(projects);

        // _logger.LogInformation("User {User} get projects", appUserId.ToString());

        await Task.CompletedTask;

        return true;
    }
}