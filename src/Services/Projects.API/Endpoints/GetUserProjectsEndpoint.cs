using FastEndpoints;
using Mediator;
using Projects.Application.Handlers;
using Projects.Domain.Contracts.Responses;

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
        Response.Projects = await _mediator.Send(new GetUserProjectsQueryV2(User), cT);
        // Response.Projects = new List<ProjectDto>();

        await SendOkAsync(Response, cT);
    }
}