using Microsoft.AspNetCore.SignalR;

namespace dotnetapi.Hubs;

public interface INotificationHub
{
    // Task SendNotification(string[] connections, AppUserFriend appUserFriend);
    Task GetNotifications(string connectionId);
}

public class NotificationHub : Hub /*<INotificationHub>*/
{
    /*public override async Task OnConnectedAsync()
    {
        var userId = Context.User!.GetUserId();
        var username = Context.User!.GetUsername();
        var connectionId = Context.ConnectionId;


        await Clients.Caller.SendAsync("GetNotifications", "Hello");
    }*/

    public async Task GetNotifications(string connectionId)
    {
        await Clients.Client(connectionId).SendAsync("GetNotifications", "data");
        await Clients.User("hazza").SendAsync("GetNotifications", "datasdasa");
        // await Clients.Client(connectionId).("GetNotifications", "data");
    }

    public string GetConnectionId()
    {
        return Context.ConnectionId;
    }
}