using FastEndpoints;
using Mediator;
using Users.API.Handlers;
// using MassTransit.Mediator;

// using Infrastructure.Entities.Identity;

// using AppUser = Users.API.Entities.AppUser;

namespace Users.API.Endpoints;

public class TestProxyEndpoint : EndpointWithoutRequest
{
    // private readonly IAuthGrpcService _authGrpcService;
    private readonly IMediator _mediator;

    public TestProxyEndpoint(IMediator mediator)
    {
        _mediator = mediator;
    }

    public override void Configure()
    {
        Get("/proxy");
        AllowAnonymous();
        // Policies("ApiScope");
    }

    public override async Task HandleAsync(CancellationToken cT)
    {
        var res = await _mediator.Send(new ProxyCommand(), cT);
        await SendOkAsync(res, cT);
    }
}