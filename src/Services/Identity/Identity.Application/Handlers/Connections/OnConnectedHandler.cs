using Identity.Application.Data.UnitOfWork;
using Identity.Application.Services.Connections;
using Identity.Contracts.Data;
using Identity.Contracts.Responses.Connections;
using Identity.SignalR.Commands.Connections;
using Identity.SignalR.Hubs;
using Infrastructure.SignalR;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace Identity.Application.Handlers.Connections;

public class OnConnectedHandler : ICommandHandler<OnConnectedCommand, bool>
{
    private readonly IConnectionsService _connections;
    private readonly IHubContext<UsersHub, IUsersHub> _hubContext;
    private readonly ILogger<OnConnectedHandler> _logger;
    private readonly IIdentityUnitOfWork _unitOfWork;

    public OnConnectedHandler(
        ILogger<OnConnectedHandler> logger,
        IHubContext<UsersHub, IUsersHub> hubContext,
        IConnectionsService connections,
        IIdentityUnitOfWork unitOfWork
    )
    {
        _logger = logger;
        _hubContext = hubContext;
        _connections = connections;
        _unitOfWork = unitOfWork;
    }

    public async ValueTask<bool> Handle(OnConnectedCommand command, CancellationToken cT)
    {
        var user = command.AuthUser;
        var userId = user.Id;
        var userConnections = _connections.GetConnections(userId);

        if (userConnections.Any())
        {
            var connectionIdExists = userConnections.Contains(command.AuthUser.ConnectionId);
            if (connectionIdExists)
                return true;
            _connections.Add(userId, command.AuthUser.ConnectionId!);
            _logger.LogInformation(
                "User {UserId} connected with ConnectionId: {ConnectionId}",
                user.ToAuthUserLog(),
                command.AuthUser.ConnectionId
            );
            return true;
        }

        _connections.Add(userId, command.AuthUser.ConnectionId!);
        _logger.LogInformation(
            "User {User} connected with ConnectionId: {ConnectionId}",
            user.ToAuthUserLog(),
            command.AuthUser.ConnectionId
        );

        var allAppUserConnections = _connections.GetAllUserConnections();

        var getOnlineUsersResponse = new GetOnlineUsersResponse
        {
            OnlineUsers = allAppUserConnections
        };

        await _hubContext.Clients.User(userId.ToString()).GetOnlineUsers(getOnlineUsersResponse);

        var appUser = await _unitOfWork.AppUsersRepository.GetByIdAsync(userId);
        appUser.ThrowHubExceptionIfNull();
        appUser.LastActiveTime = DateTime.UtcNow;
        await _unitOfWork.AppUsersRepository.UpdateAsync(appUser);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }
}
