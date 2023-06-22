using Identity.Domain;

namespace Identity.Application.Extensions;

public static class AppUserExtensions
{
    public static string GetInitials(this AppUser user)
    {
        var initials = user.FirstName[0].ToString().ToUpper();
        if (!string.IsNullOrWhiteSpace(user.LastName))
            initials += user.LastName[0].ToString().ToUpper();
        return initials;
    }
    
    public static string GetLoggingString(this AppUser user)
    {
        return $"User: {user.UserName} ({user.Id})";
    }
}