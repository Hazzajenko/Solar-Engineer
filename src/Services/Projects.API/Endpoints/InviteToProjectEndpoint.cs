using FastEndpoints;
using Mediator;
using Projects.API.Contracts.Requests.Projects;
using Projects.API.Handlers;

namespace Projects.API.Endpoints;

public class InviteToProjectEndpoint : Endpoint<InviteToProjectRequest>
{
    private readonly IMediator _mediator;

    public InviteToProjectEndpoint(IMediator mediator)
    {
        _mediator = mediator;
    }

    public override void Configure()
    {
        Post("/projects/{@projectId}", x => new { Id = x.ProjectId });
    }

    public override async Task HandleAsync(InviteToProjectRequest request, CancellationToken cT)
    {
        await _mediator.Send(new UpdateProjectCommand(User, request), cT);
        await SendNoContentAsync(cT);
    }
}