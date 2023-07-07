using System.Security.Claims;
using System.Security.Principal;
using ApplicationCore.Entities;
using ApplicationCore.Exceptions;
using Microsoft.AspNetCore.SignalR;

namespace ApplicationCore.Extensions;

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

    public static string? TryGetUserId(this ClaimsPrincipal user)
    {
        var value = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return value;
    }

    public static string GetUserName(this ClaimsPrincipal user)
    {
        var userName = user.FindFirst("userName")?.Value;
        if (userName is null)
        {
            userName = user.FindFirst(ClaimTypes.Name)?.Value;
            // userName = user.FindFirst(ClaimTypes.Name)?.Value;
            // [1]
            // http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name: jenkinsh1
            // userName = user.FindFirst(ClaimTypes.Name)?.Value;
        }

        if (userName is null)
        {
            throw new NotAuthenticatedHubException(nameof(userName));
        }
        return userName;
    }

    public static string? TryGetUserName(this ClaimsPrincipal user)
    {
        var userName = user.FindFirst("userName")?.Value;
        if (userName is null)
        {
            userName = user.FindFirst(ClaimTypes.Name)?.Value;
        }

        return userName;
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

    public static Guid? TryParseGuidUserId(this ClaimsPrincipal user)
    {
        var value = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (value is null)
            return null;
        Guid userId;
        if (value.TryParseGuid(out userId))
        {
            return userId;
        }
        return null;
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
        return value.TryToGuidOrThrow(exception);
    }

    public static Guid GetGuidUserId(this HubCallerContext context)
    {
        var user = context.User;
        if (user is null)
        {
            throw new NotAuthenticatedHubException(nameof(user));
        }
        return user.TryGetGuidUserId(new NotAuthenticatedHubException(nameof(user)));
    }

    public static string GetUserName(this HubCallerContext context)
    {
        if (context.User is null)
        {
            throw new NotAuthenticatedHubException(nameof(context.User));
        }
        return context.User.GetUserName();
    }

    /*public static ClaimsPrincipal AppUser(this HubCallerContext context)
    {
        if (context.User is not null)
            return context.User;
        var message = "User is not authenticated";
        Log.Logger.Error("{Message}", message);
        throw new HubException(message);
    }*/

    /*public static AuthUser ClaimsToAuthUser(this ClaimsPrincipal context)
    {
        // // check if in development mode
        // if (context.Identity?.Name is null)
        //     return AuthUser.Create(Guid.Parse("23424c3b-a5aa-49a1-bb70-36451b07532f"));

        var userId = context.GetGuidUserId();
        return AuthUser.Create(userId);
    }*/
}
