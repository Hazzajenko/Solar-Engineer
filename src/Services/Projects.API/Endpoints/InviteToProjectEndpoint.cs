using FastEndpoints;
using Infrastructure.Extensions;
using Mediator;
using Projects.Domain.Commands.Projects;
using Projects.Domain.Contracts.Requests.Projects;

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
    }

    public override async Task HandleAsync(InviteToProjectRequest request, CancellationToken cT)
    {
        await _mediator.Send(new InviteToProjectCommand(User.ToAuthUser(), request), cT);
        await SendNoContentAsync(cT);
    }
}