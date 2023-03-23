using FastEndpoints;
using Identity.Contracts.Responses;
using Mediator;

// using MassTransit.Mediator;

namespace Identity.API.Endpoints;

public class PingEndpoint : EndpointWithoutRequest<UserResponse>
{
    private readonly IMediator _mediator;

    // private readonly

    public PingEndpoint(IMediator mediator)
    {
        _mediator = mediator;
    }

    public override void Configure()
    {
        Post("/ping");
        AllowAnonymous();
    }

    public override async Task HandleAsync(CancellationToken cT)
    {
        await SendOkAsync(Response, cT);
    }
}