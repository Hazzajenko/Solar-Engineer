using System.IdentityModel.Tokens.Jwt;

namespace dotnetapi.Extensions;

public static class JwtExtensions
{
    public static ProviderQuery ToProviderQuery(this JwtSecurityToken request)
    {
        var sub = request.Subject;
        var subjectSplit = sub.Split('|');
        var loginProvider = subjectSplit[0];
        var providerKey = subjectSplit[1];
        return new ProviderQuery
        {
            LoginProvider = loginProvider,
            ProviderKey = providerKey
        };
    }
    
}

public class ProviderQuery
{
    public string LoginProvider { get; set; } = default!;
    public string ProviderKey { get; set; } = default!;
}
