using ApplicationCore.Extensions;
using Infrastructure.Extensions;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Users.API.Data;
using Users.API.Entities;
using Users.API.Hubs;
using Users.API.Mapping;

namespace Users.API.Handlers.Connections;

public sealed record OnConnectedAsyncCommand(HubCallerContext Context) : ICommand<bool>;

public class OnConnectedAsyncHandler : ICommandHandler<OnConnectedAsyncCommand, bool>
{
    private readonly IHubContext<ConnectionsHub, IConnectionsHub> _hubContext;
    private readonly ILogger<OnConnectedAsyncHandler> _logger;
    private readonly IConnectionsUnitOfWork _unitOfWork;

    public OnConnectedAsyncHandler(
        ILogger<OnConnectedAsyncHandler> logger,
        IConnectionsUnitOfWork unitOfWork,
        IHubContext<ConnectionsHub, IConnectionsHub> hubContext
    )
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
        _hubContext = hubContext;
    }

    public async ValueTask<bool> Handle(OnConnectedAsyncCommand request, CancellationToken cT)
    {
        ArgumentNullException.ThrowIfNull(request.Context.User);
        var userId = request.Context.User.GetUserId().ToGuid();
        var userConnection = await _unitOfWork.UserConnectionsRepository.GetByUserIdAsync(userId);

        if (userConnection is not null)
        {
            userConnection.Connections.Add(
                new WebConnection { UserId = userId, ConnectionId = request.Context.ConnectionId }
            );
            return true;
        }

        userConnection = new UserConnection
        {
            UserId = userId,
            Connections = new List<WebConnection>
            {
                new() { UserId = userId, ConnectionId = request.Context.ConnectionId }
            }
        };

        await _unitOfWork.UserConnectionsRepository.AddAsync(userConnection);
        await _unitOfWork.SaveChangesAsync();

        await _hubContext.Clients
            .AllExcept(userId.ToString())
            .UserIsOnline(userConnection.ToDtoList());

        var allConnections = await _unitOfWork.UserConnectionsRepository.GetAllConnectionsAsync();

        /*await _hubContext.Clients
            .Client(userId.ToString()).GetOnlineUsers(allConnections);*/
        await _hubContext.Clients.User(userId.ToString()).GetOnlineUsers(allConnections);

        _logger.LogInformation("User {U} connected", userId);

        return true;
    }
}