using Identity.Contracts.Data;

namespace Identity.SignalR.Hubs;

public interface IConnectionsHub
{
    Task UserIsOnline(ConnectionDto connection);
    Task UserIsOffline(ConnectionDto connection);
    Task GetOnlineUsers(IEnumerable<ConnectionDto> connections);
}