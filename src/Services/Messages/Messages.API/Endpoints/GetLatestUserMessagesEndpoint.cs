using FastEndpoints;
using Mediator;
using Messages.Application.Handlers.Http;
using Messages.Contracts.Responses;

namespace Messages.API.Endpoints;

public class GetLatestUserMessagesEndpoint : EndpointWithoutRequest<LatestUserMessagesResponse>
{
    private readonly IMediator _mediator;

    public GetLatestUserMessagesEndpoint(IMediator mediator)
    {
        _mediator = mediator;
    }

    public override void Configure()
    {
        Get("messages/users");
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        Response.Messages = await _mediator.Send(new GetLatestUserMessagesQuery(User), ct);
        await SendOkAsync(Response, ct);
    }
}
