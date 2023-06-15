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

public class SendDeviceInfoHandler : ICommandHandler<SendDeviceInfoCommand, bool>
{
    private readonly ConnectionsService _connections;

    public SendDeviceInfoHandler(ConnectionsService connections)
    {
        _connections = connections;
    }

    public ValueTask<bool> Handle(SendDeviceInfoCommand command, CancellationToken cT)
    {
        var user = command.AuthUser;
        return ValueTask.FromResult(
            _connections.AddDeviceInfoToUserIdAndConnectionId(
                user.Id,
                user.ConnectionId!,
                command.DeviceInfoDto
            )
        );
    }
}
