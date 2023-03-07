using System.Security.Claims;
using Microsoft.AspNetCore.SignalR;
using Serilog;

namespace Infrastructure.Extensions;

public static class ClaimsPrincipleExtensions
{
    public static string GetIdentity(this ClaimsPrincipal user)
    {
        var identity = user.Identity?.Name;
        if (identity is null)
            throw new ArgumentNullException(nameof(user), "identity is null");

        return identity;
    }

    public static string GetUserId(this ClaimsPrincipal user)
    {
        var value = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        ArgumentNullException.ThrowIfNull(value);
        return value;
    }

    public static Guid GetGuidUserId(this ClaimsPrincipal user)
    {
        var value = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        ArgumentNullException.ThrowIfNull(value);
        return value.ToGuid();
    }

    public static Guid TryGetGuidUserId<TException>(this ClaimsPrincipal user, TException exception)
        where TException : Exception
    {
        var value = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (value is null) throw exception;
        // ArgumentNullException.ThrowIfNull(value);
        return value.TryToGuid(exception);
    }

    public static ClaimsPrincipal AppUser(this HubCallerContext context)
    {
        if (context.User is not null)
            return context.User;
        var message = "User is not authenticated";
        Log.Logger.Error("{Message}", message);
        throw new HubException(message);
    }
}