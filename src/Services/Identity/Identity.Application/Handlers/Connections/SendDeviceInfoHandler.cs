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

public class SendDeviceInfoHandler : ICommandHandler<SendDeviceInfoCommand, bool>
{
    private readonly IConnectionsService _connections;
    private readonly IHubContext<UsersHub, IUsersHub> _hubContext;

    public SendDeviceInfoHandler(
        IConnectionsService connections,
        IHubContext<UsersHub, IUsersHub> hubContext
    )
    {
        _connections = connections;
        _hubContext = hubContext;
    }

    public async ValueTask<bool> Handle(SendDeviceInfoCommand command, CancellationToken cT)
    {
        var user = command.AuthUser;
        _connections.AddDeviceInfoToUserIdAndConnectionId(
            user.Id,
            user.ConnectionId!,
            command.DeviceInfoDto
        );
        var appUserConnection = _connections.GetAppUserConnectionByAppUserId(user.Id);
        appUserConnection.ThrowHubExceptionIfNull();

        var userIsOnlineResponse = new UserIsOnlineResponse
        {
            AppUserConnection = appUserConnection
        };

        var connectionIds = _connections.GetConnections(user.Id);
        await _hubContext.Clients.AllExcept(connectionIds).UserIsOnline(userIsOnlineResponse);
        // await _hubContext.Clients.AllExcept(user.Id.ToString()).UserIsOnline(userIsOnlineResponse);
        return true;
    }
}
