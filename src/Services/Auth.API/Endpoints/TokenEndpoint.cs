using System.Text;
using Auth.API.Contracts.Responses;
using Auth.API.Handlers;
using Auth.API.Services;
using FastEndpoints;
using Infrastructure.Extensions;
using Mediator;

// using Auth.API.RabbitMQ;

// using MassTransit.Mediator;

namespace Auth.API.Endpoints;

public class TokenEndpoint : EndpointWithoutRequest<AuthorizeResponse>
{
    private readonly IAuthService _authService;

    private readonly IMediator _mediator;
    private readonly byte[] _tokenKey;

    public TokenEndpoint(IConfiguration config, IMediator mediator, IAuthService authService)
    {
        _mediator = mediator;
        _authService = authService;
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