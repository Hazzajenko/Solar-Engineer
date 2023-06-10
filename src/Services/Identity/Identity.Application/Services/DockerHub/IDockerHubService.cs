namespace Identity.Application.Services.DockerHub;

public interface IDockerHubService
{
    Task<DockerImage> GetDockerImageData(string imageName);
}