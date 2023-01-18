using dotnetapi.Models.Dtos;
using Microsoft.AspNetCore.SignalR;

namespace dotnetapi.Hubs;

public interface INotificationsHub
{
    // Task SendNotification(string[] connections, AppUserFriend appUserFriend);
    Task GetNotifications(NotificationDto notification);
}

public class NotificationsHub : Hub<INotificationsHub>
{
    private readonly ILogger<NotificationsHub> _serilog;

    public NotificationsHub(ILogger<NotificationsHub> serilog)
    {
        _serilog = serilog;
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