using Bogus;
using EventBus.Domain.AppUserEvents;
using FastEndpoints;
using Identity.Application.Services.Pinger;
using Identity.Domain.Auth;
using Infrastructure.Contracts.Data;
using Infrastructure.Logging;
using Mapster;
using Marten;
using Mediator;
using Wolverine;
using Wolverine.Marten;

// using MassTransit.Mediator;

namespace Identity.API.Endpoints;

public class PingEndpoint : EndpointWithoutRequest<AppUserEvent>
{
    private readonly IMessageBus _bus;
    private readonly IMediator _mediator;
    private readonly IMartenOutbox _outbox;
    private readonly IDocumentSession _session;

    private readonly Faker<AppUser> _userRequestGenerator = new Faker<AppUser>()
        .RuleFor(x => x.Id, faker => Guid.NewGuid())
        .RuleFor(x => x.UserName, faker => faker.Internet.UserName())
        .RuleFor(x => x.Email, faker => faker.Internet.Email())
        .RuleFor(x => x.FirstName, faker => faker.Name.FirstName())
        .RuleFor(x => x.LastName, faker => faker.Name.LastName())
        .RuleFor(x => x.PhotoUrl, faker => faker.Internet.Url());

    // private readonly

    public PingEndpoint(
        IMediator mediator,
        IMessageBus bus,
        IDocumentSession session,
        IMartenOutbox outbox
    )
    {
        _mediator = mediator;
        _bus = bus;
        _session = session;
        _outbox = outbox;
    }

    public override void Configure()
    {
        Post("/ping");
        AllowAnonymous();
    }

    public override async Task HandleAsync(CancellationToken cT)
    {
        var pingMessage = new PingMessage { Number = 1 };
        var appUser = _userRequestGenerator.Generate();
        var userDto = appUser.Adapt<UserDto>();
        var appUserEvent = new AppUserEvent(userDto, AppUserEventType.Created);
        /*var userDto = new UserDto
        {
            Id = appUser.Id,
            FirstName = appUser.FirstName,
            LastName = appUser.LastName,
            UserName = appUser.UserName,
            DisplayName = appUser.DisplayName,
            PhotoUrl = appUser.PhotoUrl,
            CreatedTime = DateTime.Now,
            LastModifiedTime = DateTime.Now
        };*/
        /*var appUserEvent = new AppUserEvent(
            new UserDto
            {
                Id = Guid.NewGuid(),
                FirstName = "John",
                LastName = "Doe",
                UserName = "johndoe",
                DisplayName = "John Doe",
                PhotoUrl = "https://www.google.com",
                CreatedTime = DateTime.Now,
                LastModifiedTime = DateTime.Now
            },
            // "UserCreated",
            AppUserEventType.Created
        );*/
        // _session.Store(appUserEvent);
        // await _outbox.SendAsync(appUserEvent);
        appUserEvent.DumpObjectJson();
        _session.Store(appUserEvent);
        // var response = await _outbox.InvokeAsync<AppUserEventResponse>(appUserEvent, cT);
        // if (response is null) ThrowError("Failed to invoke app user event.");

        await _outbox.PublishAsync(appUserEvent);

        // await _session.SaveChangesAsync(cT);
        // await _bus.SendAsync(appUserEvent);
        // await _bus.SendAsync(pingMessage);
        await SendOkAsync(appUserEvent, cT);
        // await SendOkAsync(appUserEvent, cT);
    }
}