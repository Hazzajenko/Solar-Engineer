using System.Security.Claims;
using Microsoft.AspNetCore.SignalR;

namespace Infrastructure.SignalR;

public class HubsUserIdProvider : IUserIdProvider
{
    public string? GetUserId(HubConnectionContext connection)
    {
        return connection.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        // return connection.User?.Identity?.Name;
    }
}