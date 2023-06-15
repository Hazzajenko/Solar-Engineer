using Identity.Application.Data.UnitOfWork;
using Identity.Application.Services.Connections;
using Identity.Contracts.Data;
using Identity.SignalR.Commands.Connections;
using Identity.SignalR.Hubs;
using Infrastructure.SignalR;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace Identity.Application.Handlers.Connections;

public class OnDisconnectedHandler : ICommandHandler<OnDisconnectedCommand, bool>
{
    private readonly ConnectionsService _connections;
    private readonly IHubContext<UsersHub, IUsersHub> _hubContext;
    private readonly ILogger<OnDisconnectedHandler> _logger;
    private readonly IIdentityUnitOfWork _unitOfWork;

    public OnDisconnectedHandler(
        ILogger<OnDisconnectedHandler> logger,
        IHubContext<UsersHub, IUsersHub> hubContext,
        ConnectionsService connections,
        IIdentityUnitOfWork unitOfWork
    )
    {
        _logger = logger;
        _hubContext = hubContext;
        _connections = connections;
        _unitOfWork = unitOfWork;
    }

    public async ValueTask<bool> Handle(OnDisconnectedCommand request, CancellationToken cT)
    {
        var userId = request.AuthUser.Id;
        var userConnections = _connections.GetConnections(userId);

        if (userConnections.Any() is false)
            return true;

        _connections.Remove(userId, request.AuthUser.ConnectionId!);

        var existingConnections = _connections.GetConnections(userId);
        if (existingConnections.Any())
            return true;

        var userConnection = new ConnectionDto { AppUserId = userId.ToString() };

        await _hubContext.Clients.AllExcept(userId.ToString()).UserIsOffline(userConnection);

        _logger.LogInformation("User {U} disconnected", userId);

        var appUser = await _unitOfWork.AppUsersRepository.GetByIdAsync(userId);
        appUser.ThrowHubExceptionIfNull();
        appUser.LastActiveTime = DateTime.Now;
        await _unitOfWork.AppUsersRepository.UpdateAsync(appUser);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }
}
