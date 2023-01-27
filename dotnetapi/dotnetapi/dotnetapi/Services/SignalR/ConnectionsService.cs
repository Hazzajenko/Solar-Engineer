using dotnetapi.Data;
using dotnetapi.Models.SignalR;
using FluentValidation.Results;
using Microsoft.AspNetCore.SignalR;
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
            return isOnline;
        }

        var list = new List<WebConnection>();
        list.Add(new WebConnection
        {
            UserId = userId,
            ConnectionId = connectionId
        });
        var connection = new UserConnection
        {
            UserId = userId,
            UserName = username,
            LoggedOn = DateTime.Now,
            Connections = list
        };
        context.UserConnections.Add(connection);

        isOnline = true;


        await context.SaveChangesAsync();

        return isOnline;
    }

    public async Task<bool> UserDisconnected(string username, string connectionId)
    {
        var isOffline = false;
        using var scope = _serviceScopeFactory.CreateScope();
        await using var context = scope.ServiceProvider.GetService<InMemoryDatabase>();
        if (context is null) return false;

        var userConnection = await context.UserConnections
            .Where(x => x.UserName == username)
            .SingleOrDefaultAsync();

        if (userConnection is null) return isOffline;

        context.UserConnections.Remove(userConnection);
        await context.SaveChangesAsync();

        isOffline = true;

        return isOffline;
    }


    public async Task<UserConnection> GetUserConnections(string username)
    {
        using var scope = _serviceScopeFactory.CreateScope();
        await using var context = scope.ServiceProvider.GetService<InMemoryDatabase>();
        if (context is null)
        {
            var message = "Unable to get connections";
            throw new HubException(message);
            // throw new ValidationException(message, GenerateValidationError(message));
        }

        var userConnection = await context.UserConnections
            .Where(x => x.UserName == username)
            .Include(x => x.Connections)
            .SingleOrDefaultAsync();

        if (userConnection is null)
        {
            var message = "Unable to get user connections";
            throw new HubException(message);
        }

        // context.UserConnections.Remove(userConnection);
        // await context.SaveChangesAsync();

        // isOffline = true;

        return userConnection;
    }


    private static ValidationFailure[] GenerateValidationError(string message)
    {
        return new[]
        {
            new ValidationFailure(nameof(UserConnection), message)
        };
    }
}