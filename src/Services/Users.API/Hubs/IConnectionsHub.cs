using Users.API.Contracts.Data;

namespace Users.API.Hubs;

public interface IConnectionsHub
{
    Task UserIsOnline(IEnumerable<ConnectionDto> connections);
    Task UserIsOffline(IEnumerable<ConnectionDto> connections);
    Task GetOnlineUsers(IEnumerable<ConnectionDto> connections);
}