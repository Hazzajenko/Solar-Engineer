using Identity.Domain;

namespace Identity.Application.Extensions;

public static class AppUserExtensions
{
    public static string GetInitials(this AppUser appUser)
    {
        var initials = $"{appUser.FirstName[0]}{appUser.LastName[0]}";
        return initials;
    }
}