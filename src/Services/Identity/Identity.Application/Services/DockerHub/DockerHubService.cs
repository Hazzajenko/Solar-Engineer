using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json.Serialization;
using Infrastructure.Logging;
using Infrastructure.Settings;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Identity.Application.Services.DockerHub;

public class DockerHubService : IDockerHubService
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILogger<DockerHubService> _logger;
    private readonly DockerHubSettings _settings;
    private string? _token;

    public DockerHubService(
        IHttpClientFactory httpClientFactory,
        ILogger<DockerHubService> logger,
        IOptions<DockerHubSettings> dockerHubSettings
    )
    {
        _httpClientFactory = httpClientFactory;
        _logger = logger;
        _settings = dockerHubSettings.Value;
    }

    public async Task<DockerImage> GetDockerImageData(string imageName)
    {
        var client = await SetupHttpClient();

        _logger.LogInformation("Getting image data from DockerHub, {ImageName}", imageName);

        var imageWithAppNamePrefix = $"solarengineer-{imageName}";

        var imageData = await client.GetFromJsonAsync<GetDockerImageDataResponse>(
            $"{_settings.RepositoriesUrl}/{imageWithAppNamePrefix}/tags"
        );

        if (imageData is null)
            throw new Exception("Failed to get image data");
        return GetLatestImageTag(imageData, imageWithAppNamePrefix);
    }

    private DockerImage GetLatestImageTag(
        GetDockerImageDataResponse repositoryData,
        string imageWithAppNamePrefix
    )
    {
        return repositoryData.Results
            .OrderByDescending(image => image.TagLastPushed)
            .Select(
                x =>
                    new DockerImage
                    {
                        ServiceName = imageWithAppNamePrefix,
                        Version = x.Name,
                        LastPush = x.TagLastPushed
                    }
            )
            .First();
    }

    private async Task<HttpClient> SetupHttpClient()
    {
        var client = _httpClientFactory.CreateClient("DockerHub");
        var tokenResponse = await GetToken();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
            "Bearer",
            tokenResponse.Token
        );
        return client;
    }

    private async Task<GetTokenResponse> GetToken()
    {
        if (_token is not null)
            return new GetTokenResponse { Token = _token };

        _logger.LogInformation("Getting token from DockerHub, {UserName}", _settings.UserName);
        var client = _httpClientFactory.CreateClient("DockerHub");
        var response = await client.PostAsJsonAsync(
            "users/login",
            new GetTokenRequest { UserName = _settings.UserName, Password = _settings.Password }
        );

        if (!response.IsSuccessStatusCode)
            throw new Exception("Failed to get token");

        var data = await response.Content.ReadFromJsonAsync<GetTokenResponse>();
        if (data is null)
            throw new Exception("Token is null");
        _token = data.Token;
        var time = DateTime.UtcNow;
        var expiry = GetExpiryDate(_token);
        _logger.LogInformation(
            "Token expires at {ExpiryDate}",
            expiry?.ToString(CultureInfo.InvariantCulture)
        );

        var timeUntilTokenExpiry = expiry - time;
        _logger.LogInformation(
            "Token expires in {TimeUntilTokenExpiry} minutes",
            timeUntilTokenExpiry?.Minutes.ToString()
        );

        return data;
    }

    private static DateTime? GetExpiryDate(string token)
    {
        var handler = new JwtSecurityTokenHandler();
        var jwtToken = handler.ReadToken(token) as JwtSecurityToken;

        if (jwtToken == null)
        {
            return null;
        }

        return jwtToken.ValidTo;
    }
}

public class GetTokenRequest
{
    [JsonPropertyName("username")]
    public required string UserName { get; set; }

    [JsonPropertyName("password")]
    public required string Password { get; set; }
}

public class GetTokenResponse
{
    [JsonPropertyName("token")]
    public string Token { get; set; } = default!;
}

public class DockerImage
{
    public string ServiceName { get; set; } = default!;
    public string Version { get; set; } = default!;
    public DateTime LastPush { get; set; }
}

public class GetDockerImageDataResponse
{
    [JsonPropertyName("count")]
    public int Count { get; set; }

    [JsonPropertyName("next")]
    public object? Next { get; set; }

    [JsonPropertyName("previous")]
    public object? Previous { get; set; }

    [JsonPropertyName("results")]
    public List<DockerImageTagResult> Results { get; set; } = new();
}

public class DockerImageTagResult
{
    [JsonPropertyName("creator")]
    public int Creator { get; set; }

    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("images")]
    public List<DockerImageData> Images { get; } = new();

    [JsonPropertyName("last_updated")]
    public DateTime LastUpdated { get; set; }

    [JsonPropertyName("last_updater")]
    public int LastUpdater { get; set; }

    [JsonPropertyName("last_updater_username")]
    public string LastUpdaterUsername { get; set; } = default!;

    [JsonPropertyName("name")]
    public string Name { get; set; } = default!;

    [JsonPropertyName("repository")]
    public int Repository { get; set; }

    [JsonPropertyName("full_size")]
    public int FullSize { get; set; }

    [JsonPropertyName("v2")]
    public bool V2 { get; set; }

    [JsonPropertyName("tag_status")]
    public string TagStatus { get; set; } = default!;

    [JsonPropertyName("tag_last_pulled")]
    public DateTime TagLastPulled { get; set; }

    [JsonPropertyName("tag_last_pushed")]
    public DateTime TagLastPushed { get; set; }

    [JsonPropertyName("media_type")]
    public string MediaType { get; set; } = default!;

    [JsonPropertyName("content_type")]
    public string ContentType { get; set; } = default!;

    [JsonPropertyName("digest")]
    public string Digest { get; set; } = default!;
}

public class DockerImageData
{
    [JsonPropertyName("architecture")]
    public string Architecture { get; set; } = default!;

    [JsonPropertyName("features")]
    public string Features { get; set; } = default!;

    [JsonPropertyName("variant")]
    public object? Variant { get; set; }

    [JsonPropertyName("digest")]
    public string Digest { get; set; } = default!;

    [JsonPropertyName("os")]
    public string Os { get; set; } = default!;

    [JsonPropertyName("os_features")]
    public string OsFeatures { get; set; } = default!;

    [JsonPropertyName("os_version")]
    public object? OsVersion { get; set; }

    [JsonPropertyName("size")]
    public int Size { get; set; }

    [JsonPropertyName("status")]
    public string Status { get; set; } = default!;

    [JsonPropertyName("last_pulled")]
    public DateTime LastPulled { get; set; }

    [JsonPropertyName("last_pushed")]
    public DateTime LastPushed { get; set; }
}
