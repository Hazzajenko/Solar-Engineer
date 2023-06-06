using FastEndpoints;
using Mediator;
using Projects.Contracts.Requests.Projects;

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
        Delete("/projects/{@projectId}", x => new { Id = x.ProjectId });
        Summary(x =>
        {
            x.Summary = "Delete a project";
            x.Description = "Delete a project";
            x.Response(204, "No Content");
            x.Response(401, "Unauthorized");
        });
    }

    public override async Task HandleAsync(DeleteProjectRequest request, CancellationToken cT)
    {
        // TODO: Implement
        // await _mediator.Send(new DeleteProjectCommand(User, request), cT);
        await SendNoContentAsync(cT);
    }
}