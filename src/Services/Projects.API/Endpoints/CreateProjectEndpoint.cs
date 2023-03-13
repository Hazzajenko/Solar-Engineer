using FastEndpoints;
using Mediator;
using Projects.API.Contracts.Requests.Projects;

namespace Projects.API.Endpoints;

public class CreateProjectEndpoint : Endpoint<CreateProjectRequest>
{
    private readonly IMediator _mediator;

    public CreateProjectEndpoint(IMediator mediator)
    {
        _mediator = mediator;
    }

    public override void Configure()
    {
        Post("/projects");
    }

    public override async Task HandleAsync(CreateProjectRequest request, CancellationToken cT)
    {
        // await _mediator.Send(new CreateProjectCommand(User, request), cT);
        await SendNoContentAsync(cT);
    }
}