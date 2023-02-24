using FastEndpoints;
using Mediator;
using Projects.API.Contracts.Requests;

namespace Projects.API.Endpoints;

public class UpdateProjectEndpoint : Endpoint<UpdateProjectRequest>
{
    private readonly IMediator _mediator;

    public UpdateProjectEndpoint(IMediator mediator)
    {
        _mediator = mediator;
    }

    public override void Configure()
    {
        Put("/projects/{@projectId}", x => new { x.Id });
    }

    public override async Task HandleAsync(UpdateProjectRequest request, CancellationToken cT)
    {
        await SendNoContentAsync(cT);
    }
}