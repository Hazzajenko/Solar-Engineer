namespace Identity.API.Deprecated.Models;

public class AppUserToken
{
    public string AccessToken { get; set; } = default!;
    public int ExpiresIn { get; set; }
}