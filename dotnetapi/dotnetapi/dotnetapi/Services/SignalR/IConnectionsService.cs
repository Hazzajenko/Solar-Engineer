namespace dotnetapi.Services.SignalR;

public interface IConnectionsService
{
    Task<bool> UserConnected(int userId, string username, string connectionId);
}