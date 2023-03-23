using System.Text;
using FastEndpoints;
using Identity.Application.Handlers;
using Identity.Contracts.Responses;
using Infrastructure.Extensions;
using Mediator;

// using Identity.API.RabbitMQ;

// using MassTransit.Mediator;

namespace Identity.API.Endpoints;

public class TokenEndpoint : EndpointWithoutRequest<AuthorizeResponse>
{
    // private readonly IAuthService _authService;

    private readonly IMediator _mediator;
    private readonly byte[] _tokenKey;

    public TokenEndpoint(IConfiguration config, IMediator mediator)
    {
        _mediator = mediator;
        // _authService = authService;
        _tokenKey = Encoding.UTF8.GetBytes(config["TokenKey"]!);
        // _publishEndpoint = publishEndpoint;
    }

    public override void Configure()
    {
        Get("/token");
        // AllowAnonymous();
    }

    public override async Task HandleAsync(CancellationToken cT)
    {
        var userId = User.GetUserId().ToGuid();
        var token = await _mediator.Send(new GetTokenCommand(userId, "hazzajenko"), cT);
        Response.Token = token;
        await SendOkAsync(Response, cT);
    }
}