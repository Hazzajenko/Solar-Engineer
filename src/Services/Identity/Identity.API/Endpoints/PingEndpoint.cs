

// using MassTransit.Mediator;

namespace Identity.API.Endpoints;

// public class PingEndpoint : EndpointWithoutRequest<Acknowledgement>
// public class PingEndpoint : EndpointWithoutRequest<string>
/*public class PingEndpoint : EndpointWithoutRequest<AppUserEventV2>
{
    private readonly IMessageBus _bus;

    // private readonly IDbContextOutbox<IdentityContext> _dbContextOutbox;

    // private readonly IMessagePublisher
    // private readonly IMediator _mediator;

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
        // [FromServices] IMediator mediator,
        IMessageBus bus,
        // IDocumentSession session,
        IMartenOutbox outbox,
        IDocumentSession session
        // IDbContextOutbox<IdentityContext> dbContextOutbox
    )
    {
        // _mediator = mediator;
        _bus = bus;
        // _session = session;
        _outbox = outbox;
        _session = session;
        // _dbContextOutbox = dbContextOutbox;
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
        // var appUserEvent = new AppUserEvent(appUser.Id, userDto, AppUserEventType.Created);
        // appUserEvent.DumpObjectJson();
        DiagnosticsConfig.RequestCounter.Add(
            1,
            new KeyValuePair<string, object?>("Action", nameof(Index)),
            new KeyValuePair<string, object?>("Endpoint", nameof(PingEndpoint))
        );

        var meter = new Meter("MyApplicationMetrics");
        var requestCounter = meter.CreateCounter<int>("compute_requests");
        requestCounter.Add(1);
        var activity = HttpContext.Features.Get<IHttpActivityFeature>()?.Activity;
        activity?.SetTag("auth", "ping");

        var guidId = Guid.NewGuid();
        var appUserCreated = new AppUserCreated(guidId, userDto);
        var appUserEventV2 = new AppUserEventV2(guidId, appUserCreated);
        appUserEventV2.DumpObjectJson();
        _session.Store(appUserEventV2);
        // _outbox.Session?.Store(appUserEventV2);
        // await _session.SaveChangesAsync(cT);
        // var results = await _bus.InvokeAsync<UserCreated>(appUserEvent, cT);
        // results.DumpObjectJson();

        // _session.Store(appUserEvent);

        // await _outbox.SendAsync(appUserEvent);
        // _session.Events.StartStream(appUserEvent);
        // await _outbox.SendAsync(appUserEvent);
        await _outbox.SendAsync(appUserCreated);
        // _outbox.Session?.SaveChangesAsync(cT);
        await _session.SaveChangesAsync(cT);
        await SendOkAsync(appUserEventV2, cT);

        // await _outbox.SaveChangesAndFlushMessagesAsync(cT);

        // await _bus.SendAsync(appUserEvent);
        // await _bus.PublishAsync(appUserEvent);

        // _dbContextOutbox.DbContext.Users.Add(appUser);
        /*var test2 = await _bus.EndpointFor(
                new Uri($"rabbitmq://queue/{MessageQueues.AppUsers.EventsQueue}")
            )
            .InvokeAsync(appUserEvent, cT);#1#

        // await _dbContextOutbox.InvokeAsync<AppUserEventResponse>(appUserEvent, cT);
        // await _dbContextOutbox.PublishAsync(appUserEvent);

        // await _dbContextOutbox.SaveChangesAndFlushMessagesAsync(cT);
    }
}*/