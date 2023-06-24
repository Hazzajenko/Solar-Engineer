using FastEndpoints;
using Mediator;
using Messages.Application.Handlers.Http;
using Messages.Contracts.Requests;

namespace Messages.API.Endpoints;

public class CreateGroupChatEndpoint : Endpoint<CreateGroupChatRequest>
{
    private readonly IMediator _mediator;

    public CreateGroupChatEndpoint(IMediator mediator)
    {
        _mediator = mediator;
    }

    public override void Configure()
    {
        Post("group-chats");
    }

    public override async Task HandleAsync(CreateGroupChatRequest request, CancellationToken ct)
    {
        await _mediator.Send(new CreateGroupChatCommand(User, request), ct);
        await SendNoContentAsync(ct);
    }
}
