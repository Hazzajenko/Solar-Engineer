using FastEndpoints;
using Mediator;
using Projects.API.Contracts.Requests;
using Projects.API.Handlers;

namespace Projects.API.Endpoints;

public class DeleteProjectEndpoint : Endpoint<DeleteProjectRequest>
{
    private readonly IMediator _mediator;

    public DeleteProjectEndpoint(IMediator mediator)
    {
        _mediator = mediator;
    }

    public override void Configure()
    {
        Delete("/projects/{@projectId}", x => new { x.Id });
    }

    public override async Task HandleAsync(DeleteProjectRequest request, CancellationToken cT)
    {
        await _mediator.Send(new DeleteProjectCommand(User, request), cT);
        await SendNoContentAsync(cT);
    }
}