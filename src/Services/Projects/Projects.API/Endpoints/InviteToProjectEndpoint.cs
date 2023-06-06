using FastEndpoints;
using Infrastructure.Extensions;
using Mediator;
using Projects.Contracts.Requests.Projects;
using Projects.SignalR.Commands.Projects;

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
        Post("/projects/{@projectId}/members", x => new { Id = x.ProjectId });
        Summary(x =>
        {
            x.Summary = "Invite a user to a project";
            x.Description = "Invite a user to a project";
            x.Response(204, "No Content");
            x.Response(401, "Unauthorized");
        });
    }

    public override async Task HandleAsync(InviteToProjectRequest request, CancellationToken cT)
    {
        await _mediator.Send(new InviteToProjectCommand(User.ClaimsToAuthUser(), request), cT);
        await SendNoContentAsync(cT);
    }
}