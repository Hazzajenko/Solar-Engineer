using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;
using Application.AzureFunctions.GetApplicationVersion.Contracts;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Application.AzureFunctions.GetApplicationVersion.Function;

public class GetApplicationVersionResponse
{
    public string ServiceName { get; set; } = default!;
    public string Version { get; set; } = default!;
    public DateTime LastPush { get; set; }
}

public class GetWebUiVersion
{
    private readonly ILogger _logger;
    private readonly HttpClient _httpClient;
    private readonly DockerHubSettings _settings;

    public GetWebUiVersion(
        ILoggerFactory loggerFactory,
        IHttpClientFactory httpClientFactory,
        IOptions<DockerHubSettings> dockerHubSettings
    )
    {
        _httpClient = httpClientFactory.CreateClient("DockerHub");
        _logger = loggerFactory.CreateLogger<GetWebUiVersion>();
        _settings = dockerHubSettings.Value;
    }

    [Function("GetWebUiVersion")]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "app-version")]
            HttpRequestData req
    )
    {
        _logger.LogInformation("GetApplicationVersion function processed a request");
        var serviceName = "web-ui";

        _logger.LogInformation("Getting image data from DockerHub, {ImageName}", serviceName);

        var imageWithAppNamePrefix = $"solarengineer-{serviceName}";

        await SetupHttpClient();
        var imageData = await _httpClient.GetFromJsonAsync<GetDockerImageDataResponse>(
            $"{_settings.RepositoriesUrl}/{imageWithAppNamePrefix}/tags"
        );
        if (imageData is null)
        {
            var error = JsonSerializer.Serialize(new { error = "Failed to get image data" });
            var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            errorResponse.Headers.Add("Content-Type", "application/json");
            await errorResponse.WriteStringAsync(error);
            return errorResponse;
        }

        var latestImage = GetLatestImageTag(imageData, imageWithAppNamePrefix);

        var jsonToReturn = JsonSerializer.Serialize(latestImage);
        var response = req.CreateResponse(HttpStatusCode.OK);
        response.Headers.Add("Content-Type", "application/json");
        await response.WriteStringAsync(jsonToReturn);
        return response;
    }

    private GetApplicationVersionResponse GetLatestImageTag(
        GetDockerImageDataResponse repositoryData,
        string imageWithAppNamePrefix
    )
    {
        return repositoryData.Results
            .OrderByDescending(image => image.TagLastPushed)
            .Select(
                x =>
                    new GetApplicationVersionResponse
                    {
                        ServiceName = imageWithAppNamePrefix,
                        Version = x.Name,
                        LastPush = x.TagLastPushed
                    }
            )
            .First();
    }

    private async Task SetupHttpClient()
    {
        var tokenResponse = await GetToken();
        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
            "Bearer",
            tokenResponse.Token
        );
    }

    private async Task<GetTokenResponse> GetToken()
    {
        _logger.LogInformation("Getting token from DockerHub, {UserName}", _settings.UserName);
        var response = await _httpClient.PostAsJsonAsync(
            "users/login",
            new GetTokenRequest { UserName = _settings.UserName, Password = _settings.Password }
        );

        if (!response.IsSuccessStatusCode)
            throw new Exception("Failed to get token");

        var data = await response.Content.ReadFromJsonAsync<GetTokenResponse>();
        if (data is null)
            throw new Exception("Token is null");

        return data;
    }
}
