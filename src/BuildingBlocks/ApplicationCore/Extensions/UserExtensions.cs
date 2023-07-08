using ApplicationCore.Interfaces;

namespace ApplicationCore.Extensions;

public static class UserExtensions
{
    public static Dictionary<string, string> GetUserDictionary(this IUser user)
    {
        return new Dictionary<string, string>
        {
            ["UserId"] = user.Id.ToString(),
            ["UserName"] = user.UserName
        };
    }
}
