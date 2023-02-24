using FastEndpoints;
using Mediator;
using Messages.API.Contracts.Requests;
using Messages.API.Handlers.Http;

namespace Messages.API.Endpoints;

public class CreateGroupChatEndpoint : Endpoint<CreateGroupChatRequest>
{
    private readonly IMediator _mediator;

    public CreateGroupChatEndpoint(
        IMediator mediator)
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