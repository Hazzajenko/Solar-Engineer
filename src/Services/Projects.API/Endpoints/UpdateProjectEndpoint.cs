using FastEndpoints;
using Mediator;
using Projects.API.Contracts.Requests;
using Projects.API.Contracts.Requests.Projects;
using Projects.API.Handlers;

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
        Put("/projects/{@projectId}", x => new { Id = x.ProjectId });
    }

    public override async Task HandleAsync(UpdateProjectRequest request, CancellationToken cT)
    {
        await _mediator.Send(new UpdateProjectCommand(User, request), cT);
        await SendNoContentAsync(cT);
    }
}