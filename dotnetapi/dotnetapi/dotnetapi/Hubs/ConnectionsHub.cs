using dotnetapi.Data;
using dotnetapi.Extensions;
using dotnetapi.Hubs.Connections;
using dotnetapi.Mapping;
using dotnetapi.Models.SignalR;
using dotnetapi.Services.SignalR;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace dotnetapi.Hubs;

public class ConnectionsHub : Hub
{
    private static readonly ConnectionMapping<string> _connections = new();

    private readonly IConnectionsService _connectionsService;
    private readonly InMemoryDatabase _context;

    public ConnectionsHub(InMemoryDatabase context, IConnectionsService connectionsService)
    {
        _context = context;
        _connectionsService = connectionsService;
    }

    public override async Task OnConnectedAsync()
    {
        var userId = Context.User!.GetUserId();
        var username = Context.User!.GetUsername();
        var connectionId = Context.ConnectionId;


        var isOnline = await _connectionsService.UserConnected(Context.User!.GetUserId(),
            Context.User!.GetUsername(),
            Context.ConnectionId);

        if (isOnline)
        {
            var connectedUser = new ConnectionDto
            {
                UserId = userId,
                Username = Context.User!.GetUsername()
            };

            await Clients.Others.SendAsync("UserIsOnline", connectedUser);
        }

        var userConnections = await _context.UserConnections.Include(x => x.Connections).Select(x => x.ToUsernameDto())
            .ToListAsync();

        // var json = JsonSerializer.Serialize(userConnections);

        _connections.Add(username, Context.ConnectionId);

        await Groups.AddToGroupAsync(Context.ConnectionId, username);
        // var userName = GetUserName(Context); // get the username of the connected user

        await Groups.AddToGroupAsync(Context.ConnectionId, $"user_{username}");

        await Clients.Caller.SendAsync("GetOnlineUsers", userConnections);
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var isOffline = await _connectionsService.UserDisconnected(Context.User!.GetUsername(), Context.ConnectionId);

        var disconnectedUser = new UserConnectionDto
        {
            Username = Context.User!.GetUsername()
        };

        if (isOffline)
            await Clients.Others.SendAsync("UserIsOffline", disconnectedUser);

        await base.OnDisconnectedAsync(exception);
    }
}