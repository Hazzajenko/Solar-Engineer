using FastEndpoints;
using Mediator;
using Projects.API.Contracts.Data;
using Projects.API.Contracts.Responses;
using Projects.API.Handlers;
using Projects.API.Handlers.Projects.GetUserProjects;

namespace Projects.API.Endpoints;

public class GetUserProjectsEndpoint : EndpointWithoutRequest<GetUserProjectsResponse>
{
    private readonly IMediator _mediator;

    public GetUserProjectsEndpoint(IMediator mediator)
    {
        _mediator = mediator;
    }

    public override void Configure()
    {
        Get("/projects");
    }

    public override async Task HandleAsync(CancellationToken cT)
    {
        // Response.Projects = await _mediator.Send(new GetManyProjects(User), cT);
        Response.Projects = new List<ProjectDto>();
        await SendOkAsync(Response, cT);
    }
}