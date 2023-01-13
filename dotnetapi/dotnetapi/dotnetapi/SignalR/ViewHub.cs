using Microsoft.AspNetCore.SignalR;

namespace dotnetapi.SignalR;

public class ViewsHub : Hub
{
    private static int ViewCount { get; set; }

    public override async Task OnConnectedAsync()
    {
        ViewCount++;

        await Clients.All.SendAsync("viewCountUpdate", ViewCount);

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        ViewCount--;

        await Clients.All.SendAsync("viewCountUpdate", ViewCount);

        await base.OnDisconnectedAsync(exception);
    }
}