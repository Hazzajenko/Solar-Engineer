using FastEndpoints;
using Mediator;
using Projects.Contracts.Requests.Projects;

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
        Summary(x =>
        {
            x.Summary = "Update a project";
            x.Description = "Update a project";
            x.Response(204, "No Content");
            x.Response(401, "Unauthorized");
        });
    }

    public override async Task HandleAsync(UpdateProjectRequest request, CancellationToken cT)
    {
        // TODO: Implement
        // await _mediator.Send(new UpdateProjectCommand(User.ToAuthUser(), request), cT);
        await SendNoContentAsync(cT);
    }
}