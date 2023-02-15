using FastEndpoints;
using Infrastructure.Entities;
using MassTransit.Mediator;

namespace Auth.API.Endpoints;

public class TicketEndpoint : Endpoint<Ticket>
{
    // private readonly IMessageProducer _messagePublisher;
    private readonly IBus _bus;

    // private readonly IAuthService _authService;
    // private readonly ICatalogIntegrationEventService _catalogIntegrationEventService;
    private readonly IMediator _mediator;
    private readonly IPublishEndpoint _publishEndpoint;


    public TicketEndpoint(
        IMediator mediator, IBus bus, IPublishEndpoint publishEndpoint)
    {
        _mediator = mediator;
        // _authService = authService;
        // _messagePublisher = messagePublisher;
        // _catalogIntegrationEventService = catalogIntegrationEventService;
        _bus = bus;
        _publishEndpoint = publishEndpoint;
    }


    public override void Configure()
    {
        Post("/ticket");
        AllowAnonymous();
        // AuthSchemes(CookieAuthenticationDefaults.AuthenticationScheme);
    }

    public override async Task HandleAsync(Ticket ticket, CancellationToken cT)
    {
        /*if (ticket is null)
        {
            await SendNotFoundAsync(cT);
            return;
        }*/
        Logger.LogInformation("Ticket {Ticket}", ticket.UserName);
        ticket.BookedOn = DateTime.Now;
        var uri = new Uri("rabbitmq://localhost/ticketQueue");
        var endPoint = await _bus.GetSendEndpoint(uri);
        await endPoint.Send(ticket, cT);
        await _publishEndpoint.Publish(ticket, cT);
        await SendOkAsync(ticket, cT);
    }
}