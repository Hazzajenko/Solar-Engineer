using Microsoft.AspNetCore.SignalR;

namespace dotnetapi.SignalR;

public class UserHub : Hub
{
    [HubMethodName("trackUser")]
    public async Task RequestTrackingForVehicle(int userId)
    {
        Console.WriteLine("RequestTrackingForVehicle");

        ConnectionsManager.AddConnection(userId.ToString(), Context.ConnectionId);
        await Task.CompletedTask;
    }
}