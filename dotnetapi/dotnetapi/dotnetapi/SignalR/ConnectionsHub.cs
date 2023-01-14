using System.Text.Json;
using dotnetapi.Data;
using dotnetapi.Extensions;
using dotnetapi.Mapping;
using dotnetapi.Models.SignalR;
using dotnetapi.Services.SignalR;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace dotnetapi.SignalR;

// [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
public class ConnectionsHub : Hub
{
    private readonly IConnectionsService _connectionsService;

    private readonly InMemoryDatabase _context;
    private readonly ConnectionsTracker _tracker;

    public ConnectionsHub(ConnectionsTracker tracker, InMemoryDatabase context, IConnectionsService connectionsService)
    {
        _tracker = tracker;
        _context = context;
        _connectionsService = connectionsService;
    }

    /*public Task UserConnected(int user, string message, string username)
    {
        var userName = dbService.GetUserName(user);
        return Clients.All.SendAsync("ReceiveMessage", userName, message);
    }*/

    public override async Task OnConnectedAsync()
    {
        var userId = Context.User!.GetUserId();
        var username = Context.User!.GetUsername();
        var connectionId = Context.ConnectionId;


        Console.WriteLine(Context.User!.GetUserId());
        Console.WriteLine(Context.User!.GetUsername());
        /*var isOnline = await _tracker.UserConnected(Context.User!.GetUsername(), Context.ConnectionId);
        if (isOnline)
            await Clients.Others.SendAsync("UserIsOnline", Context.User!.GetUsername());*/

        var isOnline = await _connectionsService.UserConnected(Context.User!.GetUserId(),
            Context.User!.GetUsername(),
            Context.ConnectionId);
        /*var isOnline = await _tracker.UserConnectedV2(Context.User!.GetUserId(), Context.User!.GetUsername(),
            Context.ConnectionId);*/
        // var connection = new Connection(Context.ConnectionId, Context.User!.GetUserId(), Context.User!.GetUsername());
        /*var connection = new UserConnectionV2
        {
            Id = userId,
            Username = username,
            LoggedOn = DateTime.Now,
            ConnectionId = new List<string> { connectionId }
            /*ConnectionIds = new List<ConnectionId>
            {
                new()
                {
                    Id = connectionId,
                    UserConnectionId = userId
                }
            }#1#
        };
        _context.Connections.Add(connection);*/
        // await _context.SaveChangesAsync();
        if (isOnline)
        {
            var connectedUser = new ConnectionDto
            {
                UserId = userId,
                Username = Context.User!.GetUsername()
            };

            await Clients.Others.SendAsync("UserIsOnline", connectedUser);
        }

        var connecs = _context.UserConnections.Include(x => x.Connections).Select(x => x.ToUsernameDto()).ToListAsync();
        // Console.Write(connecs.Result);
        /*var connecs = _context.Connections.Include(x => x.)
            .ToListAsync();*/
        var json = JsonSerializer.Serialize(connecs.Result);
        Console.Write(json);
        // var currentUsers = await _tracker.GetOnlineUsersV2();
        // var currentUsers = await _tracker.GetOnlineUsersV3();

        // Console.WriteLine(currentUsers);
        await Clients.Caller.SendAsync("GetOnlineUsers", connecs.Result);
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var isOffline = await _tracker.UserDisconnected(Context.User!.GetUsername(), Context.ConnectionId);

        if (isOffline)
            await Clients.Others.SendAsync("UserIsOffline", Context.User!.GetUsername());

        await base.OnDisconnectedAsync(exception);
    }

    public async Task GetCurrentConnectionList()
    {
        // var result = await toDoRepository.GetList(listId);
        var currentUsers = await _tracker.GetOnlineUsersV3();
        await Clients.Caller.SendAsync("GetOnlineUsers", currentUsers);
    }
}