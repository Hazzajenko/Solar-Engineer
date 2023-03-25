using EventBus.Domain.AppUserEvents;
using FastEndpoints;
using Identity.Application.Services.Pinger;
using Infrastructure.Contracts.Data;
using Mediator;
using Wolverine;

// using MassTransit.Mediator;

namespace Identity.API.Endpoints;

public class PingEndpoint : EndpointWithoutRequest<AppUserEvent>
{
    private readonly IMessageBus _bus;
    private readonly IMediator _mediator;

    // private readonly

    public PingEndpoint(IMediator mediator, IMessageBus bus)
    {
        _mediator = mediator;
        _bus = bus;
    }

    public override void Configure()
    {
        Post("/ping");
        AllowAnonymous();
    }

    public override async Task HandleAsync(CancellationToken cT)
    {
        var pingMessage = new PingMessage { Number = 1 };
        var appUserEvent = new AppUserEvent(
            new UserDto
            {
                Id = Guid.NewGuid(),
                FirstName = "John",
                LastName = "Doe",
                DisplayName = "John Doe",
                PhotoUrl = "https://www.google.com",
                CreatedTime = DateTime.Now,
                LastModifiedTime = DateTime.Now
            },
            // "UserCreated",
            AppUserEventType.Created
        );
        await _bus.SendAsync(appUserEvent);
        // await _bus.SendAsync(pingMessage);
        await SendOkAsync(appUserEvent, cT);
    }
}