namespace Infrastructure.Settings;

public class DockerHubSettings
{
    public string ApiBaseUrl { get; set; } = default!;
    public string RepositoriesUrl { get; set; } = default!;
    public string UserName { get; set; } = default!;
    public string Password { get; set; } = default!;
}