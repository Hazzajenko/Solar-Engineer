using System.Security.Claims;
using Infrastructure.Authentication;
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

    public static string GetUserName(this ClaimsPrincipal user)
    {
        var value = user.FindFirst("userName")?.Value;
        if (value is null)
        {
            value = user.FindFirst(ClaimTypes.Name)?.Value;
        }
        ArgumentNullException.ThrowIfNull(value);
        return value;
    }

    /// <summary>
    ///     Get the user id as a Guid.
    ///     If the user id is not a Guid, then throw an exception.
    /// </summary>
    public static Guid GetGuidUserId(this ClaimsPrincipal user)
    {
        var value = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        ArgumentNullException.ThrowIfNull(value);
        return value.ToGuid();
    }

    /// <summary>
    ///     Try to get the user id as a Guid.
    ///     If the user id is not a Guid, then throw an exception.
    /// </summary>
    public static Guid TryGetGuidUserId<TException>(this ClaimsPrincipal user, TException exception)
        where TException : Exception
    {
        var value = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (value is null)
            throw exception;
        // ArgumentNullException.ThrowIfNull(value);
        return value.TryToGuidOrThrow(exception);
    }

    public static ClaimsPrincipal AppUser(this HubCallerContext context)
    {
        if (context.User is not null)
            return context.User;
        var message = "User is not authenticated";
        Log.Logger.Error("{Message}", message);
        throw new HubException(message);
    }

    /// <summary>
    ///     Get the user id as a Guid.
    ///     If the user id is not a Guid, then throw an exception.
    /// </summary>
    public static AuthUser ClaimsToAuthUser(this ClaimsPrincipal context)
    {
        // check if in development mode
        if (context.Identity?.Name is null)
            return AuthUser.Create(Guid.Parse("23424c3b-a5aa-49a1-bb70-36451b07532f"));

        var userId = context.GetGuidUserId();
        return AuthUser.Create(userId);
    }
}
