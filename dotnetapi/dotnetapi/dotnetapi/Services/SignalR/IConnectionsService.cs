using dotnetapi.Models.SignalR;

namespace dotnetapi.Services.SignalR;

public interface IConnectionsService
{
    Task<bool> UserConnected(int userId, string username, string connectionId);
    Task<bool> UserDisconnected(string username, string connectionId);
    Task<UserConnection> GetUserConnections(string username);
}