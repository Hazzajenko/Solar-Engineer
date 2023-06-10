using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = new HostBuilder();
builder.ConfigureFunctionsWorkerDefaults();

builder.ConfigureServices(
    (context, services) =>
    {
        services.Configure<DockerHubSettings>(settings =>
        {
            settings.ApiBaseUrl = GetEnvironmentVariable("DOCKER_HUB__API_BASE_URL");
            settings.RepositoriesUrl = GetEnvironmentVariable("DOCKER_HUB__REPOSITORIES_URL");
            settings.UserName = GetEnvironmentVariable("DOCKER_HUB__USER_NAME");
            settings.Password = GetEnvironmentVariable("DOCKER_HUB__PASSWORD");
        });

        services.AddHttpClient(
            "DockerHub",
            httpClient =>
            {
                var baseUrl = GetEnvironmentVariable("DOCKER_HUB__API_BASE_URL");
                Console.WriteLine(baseUrl);
                ArgumentNullException.ThrowIfNull(baseUrl);
                httpClient.BaseAddress = new Uri(baseUrl);
            }
        );
    }
);

var host = builder.Build();

await host.RunAsync();

string GetEnvironmentVariable(string name)
{
    var value = Environment.GetEnvironmentVariable(name);
    if (value is null)
    {
        throw new Exception($"Environment variable {name} is not set");
    }

    return value;
}

public class DockerHubSettings
{
    public string ApiBaseUrl { get; set; } = default!;
    public string RepositoriesUrl { get; set; } = default!;
    public string UserName { get; set; } = default!;
    public string Password { get; set; } = default!;
}
