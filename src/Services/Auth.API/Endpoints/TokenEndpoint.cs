using System.Text;
using Auth.API.Contracts.Responses;
using Auth.API.Handlers;
using Auth.API.Services;
using EventBus.Services;
using FastEndpoints;
using Infrastructure.Extensions;
using Mediator;

// using Auth.API.RabbitMQ;

// using MassTransit.Mediator;

namespace Auth.API.Endpoints;

public class TokenEndpoint : EndpointWithoutRequest<AuthorizeResponse>
{
    private readonly IAuthService _authService;
    private readonly IBus _bus;

    private readonly IMediator _mediator;
    private readonly IPublishEndpoint _publishEndpoint;
    private readonly IEventPublisherService _publisherService;
    private readonly byte[] _tokenKey;


    public TokenEndpoint(IConfiguration config,
        IMediator mediator, IAuthService authService, IBus bus, IEventPublisherService publisherService,
        IPublishEndpoint publishEndpoint /*,
        IPublishEndpoint publishEndpoint*/)
    {
        _mediator = mediator;
        _authService = authService;
        _bus = bus;
        _publisherService = publisherService;
        _publishEndpoint = publishEndpoint;
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
        var token = await _mediator.Send(new GetTokenCommand(userId), cT);
        Response.Token = token;
        await SendOkAsync(Response, cT);
    }
}