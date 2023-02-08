using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using dotnetapi.Extensions;
using dotnetapi.Features.Auth.Data;
using dotnetapi.Features.Users.Entities;
using dotnetapi.Settings;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace dotnetapi.Services.Http;

public interface IHttpClientFactoryService
{
    Task<bool> GetAuth0Token();
    Task<Auth0UserDto?> GetAuthUser(string sub);
    Task<T?> GetHttpData<T>(string uri, string? args = null);
    Task<RefreshTokenResponse?> RefreshToken(string refreshToken);
}

public class HttpClientFactoryFactoryService : IHttpClientFactoryService
{
    private static AuthToken _token = new();

    private static DateTime _tokenSet;
    private readonly HttpClient _authHttp;
    private readonly Auth0Settings _credentials;
    private readonly JsonSerializerOptions _options;

    public HttpClientFactoryFactoryService(
        IHttpClientFactory httpClientFactory,
        IOptions<Auth0Settings> auth0Settings
    )
    {
        _authHttp = httpClientFactory.CreateClient("Auth0");
        _credentials = auth0Settings.Value;
        _options = new JsonSerializerOptions
        {
            PropertyNamingPolicy = new NamingPolicies.SnakeCaseNamingPolicy()
        };
    }

    public async Task<bool> GetAuth0Token()
    {
        var seconds = _tokenSet.Second - DateTime.Now.Second;
        Console.WriteLine(seconds);

        if (!_token.AccessToken.IsNullOrEmpty() && _token.ExpiresIn - seconds > 1000)
            return true;

        var credentials = JsonSerializer.Serialize(_credentials);
        var content = new StringContent(credentials, Encoding.UTF8, "application/json");

        using var response = await _authHttp.PostAsync("oauth/token", content);
        response.EnsureSuccessStatusCode();
        var token = await response.Content.ReadFromJsonAsync<AuthToken>(_options);

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

    public async Task<T?> GetHttpData<T>(string uri, string? args = null)
    {
        if (IsTokenValid() is false) await GetAuth0Token();
        var path = $"{uri}/{args ?? string.Empty}";
        _authHttp.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
            "Bearer",
            _token.AccessToken
        );

        using var response = await _authHttp.GetAsync(path);
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<T>(_options);
    }

    public async Task<RefreshTokenResponse?> RefreshToken(string refreshToken)
    {
        if (IsTokenValid() is false) await GetAuth0Token();
        var path = "oauth/token";

        var request = new RefreshTokenRequest
        {
            GrantType = "refresh_token",
            ClientId = _credentials.ClientId,
            ClientSecret = _credentials.ClientSecret,
            RefreshToken = refreshToken
        };

        var refreshRequest = JsonSerializer.Serialize(request);
        var content = new StringContent(refreshRequest, Encoding.UTF8, "application/json");
        using var response = await _authHttp.PostAsync(path, content);
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<RefreshTokenResponse>(_options);
    }

    private bool IsTokenValid()
    {
        var seconds = _tokenSet.Second - DateTime.Now.Second;
        return !_token.AccessToken.IsNullOrEmpty() || _token.ExpiresIn - seconds > 1000;
    }
}