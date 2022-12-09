using System.Security.Claims;

namespace dotnetapi.Extensions;

public static class ClaimsPrincipleExtensions {
    public static string GetUsername(this ClaimsPrincipal user) {
        var username = user.FindFirst(ClaimTypes.Name)?.Value;
        if (username == null) {
            throw new ArgumentNullException(nameof(user));
        } else {
            return username;
        }
    }

    public static int GetUserId(this ClaimsPrincipal user) {
        var value = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (value == null) {
            throw new ArgumentNullException(nameof(user));
        } else {
            return int.Parse(value);
        }

    }
}