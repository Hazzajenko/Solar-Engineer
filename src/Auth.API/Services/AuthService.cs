using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

using Auth.API.Contracts.Data;
using Auth.API.Extensions;
using Auth.API.Settings;

using Microsoft.Extensions.Options;

namespace Auth.API.Services;

public class AuthService : IAuthService
{
    private Token _token = new();
    private DateTime _tokenSet;
    private readonly HttpClient _authHttp;
    private readonly AuthSettings _credentials;
    private readonly JsonSerializerOptions _options;

    public AuthService(
        IHttpClientFactory httpClientFactory,
        IOptions<AuthSettings> auth0Settings
    )
    {
        _authHttp = httpClientFactory.CreateClient("Auth0");
        _credentials = auth0Settings.Value;
        _options = new JsonSerializerOptions
        {
            PropertyNamingPolicy = new NamingPolicyExtensions.SnakeCaseNamingPolicy()
        };
    }

    public async Task<Auth0UserDto?> GetAuthUser(string sub)
    {
        if (IsTokenValid() is false) await GetAuthToken();
        var path = $"api/v2/users/{sub}";
        _authHttp.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
            "Bearer",
            _token.AccessToken
        );
        using var response = await _authHttp.GetAsync(path);
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<Auth0UserDto>(_options);
    }
    
    private async Task GetAuthToken()
    {
        var credentials = JsonSerializer.Serialize(_credentials);
        var content = new StringContent(credentials, Encoding.UTF8, "application/json");

        using var response = await _authHttp.PostAsync("oauth/token", content);
        response.EnsureSuccessStatusCode();
        var token = await response.Content.ReadFromJsonAsync<Token>(_options);

        _token = token ?? throw new ArgumentNullException(nameof(token));
        _tokenSet = DateTime.Now;
    }
    
    private bool IsTokenValid()
    {
        var seconds = _tokenSet.Second - DateTime.Now.Second;
        return !String.IsNullOrEmpty(_token.AccessToken) || _token.ExpiresIn - seconds > 1000;
    }
}