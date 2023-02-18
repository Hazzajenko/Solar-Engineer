using Auth.API.Services;
using DotNetCore.Extensions;
using EventBus.Services;
using FastEndpoints;
using Mediator;

// using Auth.API.RabbitMQ;

// using MassTransit.Mediator;

namespace Auth.API.Endpoints;

public record RandomObj
{
    public Guid Id { get; set; } = Guid.NewGuid();

    // public Random rnd = new Random();
    public string Data { get; set; } = new Random().Next(1, 1000).ToString();
}

public class TestEndpoint : EndpointWithoutRequest<RandomObj>
{
    private readonly IAuthService _authService;
    private readonly IBus _bus;
    private readonly IMediator _mediator;
    private readonly IPublishEndpoint _publishEndpoint;
    private readonly IEventPublisherService _publisherService;


    public TestEndpoint(
        IMediator mediator, IAuthService authService, IBus bus, IEventPublisherService publisherService,
        IPublishEndpoint publishEndpoint /*,
        IPublishEndpoint publishEndpoint*/)
    {
        _mediator = mediator;
        _authService = authService;
        _bus = bus;
        _publisherService = publisherService;
        _publishEndpoint = publishEndpoint;
        // _publishEndpoint = publishEndpoint;
    }


    public override void Configure()
    {
        Post("/test");
        AllowAnonymous();
    }

    public override async Task HandleAsync(CancellationToken cT)
    {
        Logger.LogInformation("User {User}", User.Id());
        var message = new RandomObj();
        /*var endpoint = await _bus.GetSendEndpoint(new Uri(
            "Endpoint=sb://solarengineer.servicebus.windows.net/;SharedAccessKeyName=boss;SharedAccessKey=0/gLgr7UCAW6ApZ25mrGqTllh4rjhovwd+ASbHEAIFc=;EntityPath=solarqueue"));
        await endpoint.Send(message, cT);*/
        // await _publishEndpoint.Publish(message, cT);
        await _bus.Publish(message, cT);

        await SendOkAsync(message, cT);
    }
}