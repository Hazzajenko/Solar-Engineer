namespace Identity.API.Deprecated.Services;

public interface IRedirectService
{
    string ExtractRedirectUriFromReturnUrl(string url);
}