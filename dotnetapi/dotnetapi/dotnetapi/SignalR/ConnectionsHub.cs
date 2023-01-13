using dotnetapi.Extensions;
using Microsoft.AspNetCore.SignalR;

namespace dotnetapi.SignalR;

// [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
public class ConnectionsHub : Hub
{
    private readonly ConnectionsTracker _tracker;

    public ConnectionsHub(ConnectionsTracker tracker)
    {
        _tracker = tracker;
    }

    public override async Task OnConnectedAsync()
    {
        Console.WriteLine(Context.User!.GetUsername());
        var isOnline = await _tracker.UserConnected(Context.User!.GetUsername(), Context.ConnectionId);
        if (isOnline)
            await Clients.Others.SendAsync("UserIsOnline", Context.User!.GetUsername());

        var currentUsers = await _tracker.GetOnlineUsers();
        Console.WriteLine(currentUsers);
        await Clients.Caller.SendAsync("GetOnlineUsers", currentUsers);
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var isOffline = await _tracker.UserDisconnected(Context.User!.GetUsername(), Context.ConnectionId);

        if (isOffline)
            await Clients.Others.SendAsync("UserIsOffline", Context.User!.GetUsername());

        await base.OnDisconnectedAsync(exception);
    }
}