using FastEndpoints;
using Mediator;
using Projects.Domain.Contracts.Requests.Projects;

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
        Summary(x =>
        {
            x.Summary = "Create a new project";
            x.Description = "Create a new project";
            x.Response(201, "Created");
            x.Response(401, "Unauthorized");
        });
    }

    public override async Task HandleAsync(CreateProjectRequest request, CancellationToken cT)
    {
        // await _mediator.Send(new CreateProjectCommand(User, request), cT);
        await SendNoContentAsync(cT);
    }
}