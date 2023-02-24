using Microsoft.AspNetCore.SignalR;

namespace Infrastructure.SignalR;

public class HubsUserIdProvider : IUserIdProvider
{
    public string? GetUserId(HubConnectionContext connection)
    {
        return connection.User?.Identity?.Name;
    }
}