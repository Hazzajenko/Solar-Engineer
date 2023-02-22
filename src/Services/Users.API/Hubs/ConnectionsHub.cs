using Infrastructure.Extensions;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore.InMemory.Storage.Internal;

namespace Users.API.Hubs;

public class ConnectionsHub : Hub
{
    /*private readonly IConnectionsService _connectionsService;
    private readonly InMemoryDatabase _context;*/
    private readonly ILogger<ConnectionsHub> _logger;

    public ConnectionsHub(
        ILogger<ConnectionsHub> logger)
    {
        _logger = logger;
    }

    private static int ConnectedCount { get; set; }

    /*public override async Task OnConnectedAsync()
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
                UserName = Context.User!.GetUsername()
            };

            await Clients.Others.SendAsync("UserIsOnline", connectedUser);
        }

        var userConnections = await _context.UserConnections.Include(x => x.Connections).Select(x => x.ToUsernameDto())
            .ToListAsync();

        // var json = JsonSerializer.Serialize(userConnections);

        // _connections.Add(username, Context.ConnectionId);

        await Groups.AddToGroupAsync(Context.ConnectionId, username);
        // var userName = GetUserName(Context); // get the username of the connected user

        await Groups.AddToGroupAsync(Context.ConnectionId, $"user_{username}");

        await Clients.Caller.SendAsync("GetOnlineUsers", userConnections);

        ConnectedCount++;
        _logger.LogInformation("OnConnectedAsync {ConnectedCount}, User {Username}", ConnectedCount,
            Context.User!.GetUsername());

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var isOffline = await _connectionsService.UserDisconnected(Context.User!.GetUsername(), Context.ConnectionId);

        var disconnectedUser = new UserConnectionDto
        {
            UserName = Context.User!.GetUsername()
        };

        if (isOffline)
            await Clients.Others.SendAsync("UserIsOffline", disconnectedUser);

        ConnectedCount--;
        _logger.LogInformation("OnDisconnectedAsync {ConnectedCount}, User {Username}", ConnectedCount,
            Context.User!.GetUsername());

        await base.OnDisconnectedAsync(exception);
    }*/
}