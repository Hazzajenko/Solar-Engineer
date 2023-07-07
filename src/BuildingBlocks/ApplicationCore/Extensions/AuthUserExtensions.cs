using System.Security.Claims;
using ApplicationCore.Entities;
using Microsoft.AspNetCore.SignalR;

namespace ApplicationCore.Extensions;

public static class AuthUserExtensions
{
    public static AuthUser ToAuthUser(this ClaimsPrincipal context)
    {
        Guid userId = context.GetGuidUserId();
        var userName = context.GetUserName();
        return AuthUser.Create(userId, userName);
    }

    public static AuthUser ToAuthUser(this HubCallerContext context)
    {
        Guid userId = context.GetGuidUserId();
        var userName = context.GetUserName();
        return AuthUser.Create(userId, userName, context.ConnectionId);
    }
}
