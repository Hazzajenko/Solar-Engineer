using Microsoft.AspNetCore.SignalR;

namespace dotnetapi.Services.SignalR;

public class NameUserIdProvider : IUserIdProvider
{
    public string? GetUserId(HubConnectionContext connection)
    {
        return connection.User?.Identity?.Name;
    }
}