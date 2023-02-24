using FastEndpoints;
using Mediator;
using Messages.API.Contracts.Responses;
using Messages.API.Handlers;
using Messages.API.Handlers.Http;

namespace Messages.API.Endpoints;

public class GetLatestGroupChatMessagesEndpoint : EndpointWithoutRequest<LatestGroupChatMessagesResponse>
{
    private readonly IMediator _mediator;

    public GetLatestGroupChatMessagesEndpoint(
        IMediator mediator)
    {
        _mediator = mediator;
    }

    public override void Configure()
    {
        Get("messages/group-chats");
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        Response.GroupChats = await _mediator.Send(new GetLatestGroupChatMessagesQuery(User), ct);
        await SendOkAsync(Response, ct);
    }
}