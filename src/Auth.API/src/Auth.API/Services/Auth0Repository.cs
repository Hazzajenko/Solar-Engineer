using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

using Auth.API.Data;
using Auth.API.Extensions;
using Auth.API.Settings;

using Microsoft.Extensions.Options;

namespace Auth.API.Services;

public class Auth0Repository : IAuth0Repository
{
    private Token _token = new();

    private static DateTime _tokenSet;
    private readonly HttpClient _authHttp;
    private readonly Auth0Settings _credentials;
    private readonly JsonSerializerOptions _options;

    public Auth0Repository(
        IHttpClientFactory httpClientFactory,
        IOptions<Auth0Settings> auth0Settings
    )
    {
        _authHttp = httpClientFactory.CreateClient("Auth0");
        _credentials = auth0Settings.Value;
        _options = new JsonSerializerOptions
        {
            PropertyNamingPolicy = new NamingPolicyExtensions.SnakeCaseNamingPolicy()
        };
    }
    
    public async Task<bool> GetAuth0Token()
    {
        var seconds = _tokenSet.Second - DateTime.Now.Second;

        if (!String.IsNullOrEmpty(_token.AccessToken) && _token.ExpiresIn - seconds > 1000)
            return true;

        var credentials = JsonSerializer.Serialize(_credentials);
        var content = new StringContent(credentials, Encoding.UTF8, "application/json");

        using var response = await _authHttp.PostAsync("oauth/token", content);
        response.EnsureSuccessStatusCode();
        var token = await response.Content.ReadFromJsonAsync<Token>(_options);

        _token = token ?? throw new NullReferenceException("Token null");
        _tokenSet = DateTime.Now;

        return true;
    }
    
    public async Task<Auth0UserDto?> GetAuthUser(string sub)
    {
        if (IsTokenValid() is false) await GetAuth0Token();
        var path = $"api/v2/users/{sub}";
        _authHttp.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
            "Bearer",
            _token.AccessToken
        );
        using var response = await _authHttp.GetAsync(path);
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<Auth0UserDto>(_options);
    }
    
    private bool IsTokenValid()
    {
        var seconds = _tokenSet.Second - DateTime.Now.Second;
        return !String.IsNullOrEmpty(_token.AccessToken) || _token.ExpiresIn - seconds > 1000;
    }
}