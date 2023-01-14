using dotnetapi.Data;
using dotnetapi.Models.Entities;
using dotnetapi.Models.SignalR;
using FluentValidation.Results;
using Microsoft.EntityFrameworkCore;

namespace dotnetapi.Services.SignalR;

public class ConnectionsService : IConnectionsService
{
    private readonly IServiceScopeFactory _serviceScopeFactory;


    public ConnectionsService(IServiceScopeFactory serviceScopeFactory)
    {
        _serviceScopeFactory = serviceScopeFactory;
    }

    public async Task<bool> UserConnected(int userId, string username, string connectionId)
    {
        var isOnline = false;
        using var scope = _serviceScopeFactory.CreateScope();
        await using var context = scope.ServiceProvider.GetService<InMemoryDatabase>();
        if (context is null) return false;
        
        var userConnection = await context.UserConnections
            .Where(x => x.UserId == userId)
            .SingleOrDefaultAsync();

        if (userConnection is not null)
        {
            userConnection.Connections.Add(new WebConnection
            {
                UserId = userId,
                ConnectionId = connectionId
            });
        }
        else
        {
            var list = new List<WebConnection>();
            list.Add(new WebConnection
            {
                UserId = userId,
                ConnectionId = connectionId
            });
            var connection = new UserConnection
            {
                UserId = userId,
                Username = username,
                LoggedOn = DateTime.Now,
                Connections = list
            };
            context.UserConnections.Add(connection);
            // connection.ConnectionIds.Add(connectionId);
            // OnlineConnections.Add(username, connection);
            isOnline = true;
        }

        await context.SaveChangesAsync();

        return isOnline;
    }
    
    /*public Task<bool> UserDisconnected(string username, string connectionId)
    {
        var isOffline = false;
        lock (OnlineUsers)
        {
            if (!OnlineUsers.ContainsKey(username)) return Task.FromResult(isOffline);

            OnlineUsers[username].Remove(connectionId);
            if (OnlineUsers[username].Count == 0)
            {
                OnlineUsers.Remove(username);
                isOffline = true;
            }
        }

        return Task.FromResult(isOffline);
    }*/


    private static ValidationFailure[] GenerateValidationError(string message)
    {
        return new[]
        {
            new ValidationFailure(nameof(Project), message)
        };
    }
}