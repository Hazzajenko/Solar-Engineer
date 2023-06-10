using FastEndpoints;
using Identity.Application.Services.DockerHub;

namespace Identity.API.Endpoints.App;

public class GetAppVersionEndpoint : EndpointWithoutRequest<DockerImage>
{
    private readonly IDockerHubService _dockerHubService;

    public GetAppVersionEndpoint(IDockerHubService dockerHubService)
    {
        _dockerHubService = dockerHubService;
    }

    public override void Configure()
    {
        Get("/version");
        AllowAnonymous();
    }

    public override async Task HandleAsync(CancellationToken cT)
    {
        var imageData = await _dockerHubService.GetDockerImageData("web-ui");
        Response = imageData;
        await SendOkAsync(Response, cT);
    }
}