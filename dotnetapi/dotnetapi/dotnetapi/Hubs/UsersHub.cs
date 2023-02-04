using dotnetapi.Features.Users.Data;
using Microsoft.AspNetCore.SignalR;

namespace dotnetapi.Hubs;

public interface IUsersHub
{
    // Task SendNotification(string[] connections, AppUserFriend appUserFriend);
    Task GetAppUserLinks(IEnumerable<AppUserLinkDto> appUserLinks);
}

public class UsersHub : Hub<IUsersHub>
{
    private readonly ILogger<UsersHub> _logger;

    public UsersHub(ILogger<UsersHub> logger)
    {
        _logger = logger;
    }

    /*public override async Task OnConnectedAsync() {
        ConnectedCount++;
        _serilog.LogInformation("OnConnectedAsync {ConnectedCount}, Id {Id}", ConnectedCount, Context.ConnectionId);
        await Clients.All.ConnectedUpdate(ConnectedCount);

        await base.OnConnectedAsync();
    }*/
    /*public override async Task OnConnectedAsync()
    {
        var userId = Context.User!.GetUserId();
        var username = Context.User!.GetUsername();
        var connectionId = Context.ConnectionId;


        await Clients.Caller.SendAsync("GetNotifications", "Hello");
    }*/

    public async Task GetNotifications(string connectionId)
    {
        // await Clients.Client(connectionId).SendAsync("GetNotifications", "data");
        // await Clients.User("hazza").SendAsync("GetNotifications", "datasdasa");
        // await Clients.Client(connectionId).("GetNotifications", "data");
    }

    public string GetConnectionId()
    {
        return Context.ConnectionId;
    }
}