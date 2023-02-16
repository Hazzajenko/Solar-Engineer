using Auth.API.Commands;
using Auth.API.Contracts.Responses;
using Auth.API.Mapping;
using Auth.API.RabbitMQ;
using Auth.API.Services;
using EventBus.Mapping;
using FastEndpoints;
using MassTransit.Mediator;
using Microsoft.AspNetCore.Authentication.Cookies;

namespace Auth.API.Endpoints;

public class AuthorizeEndpoint : EndpointWithoutRequest<AuthorizeResponse>
{
    private readonly IAuthService _authService;

    // private readonly ICatalogIntegrationEventService _catalogIntegrationEventService;
    private readonly IMediator _mediator;
    private readonly IMessageProducer _messagePublisher;
    private readonly IPublishEndpoint _publishEndpoint;


    public AuthorizeEndpoint(
        IMediator mediator, IAuthService authService, IMessageProducer messagePublisher,
        IPublishEndpoint publishEndpoint)
    {
        _mediator = mediator;
        _authService = authService;
        _messagePublisher = messagePublisher;
        _publishEndpoint = publishEndpoint;
        // _catalogIntegrationEventService = catalogIntegrationEventService;
    }


    public override void Configure()
    {
        Get("/authorize");
        AuthSchemes(CookieAuthenticationDefaults.AuthenticationScheme);
    }

    public override async Task HandleAsync(CancellationToken cT)
    {
        var appUser = await new AuthorizeCommand(HttpContext).ExecuteAsync(cT);
        // var appUser = await _mediator.Send(new AuthorizeCommand(HttpContext), cT);
        var token = await _authService.Generate(appUser);
        Response.User = appUser.ToCurrentUserDto();
        Response.Token = token.Token;
        var appUserCreatedEvent = appUser.ToEvent().Created();
        // evy.Created();
        // evy.
        // var ev = new AppUserCreatedEvent(appUser.ToDto());
        /*var newAppUser = new AppUserCreatedEvent
        {
            Id = appUser.Id,
            FirstName = appUser.FirstName,
            LastName = appUser.LastName,
            DisplayName = appUser.DisplayName,
            PhotoUrl = appUser.PhotoUrl,
            CreatedTime = appUser.CreatedTime,
            LastActiveTime = appUser.LastActiveTime
        };*/
        await _publishEndpoint.Publish(appUserCreatedEvent, cT);
        /*
        _messagePublisher.SendMessage(appUser.ToCurrentUserDto());
        var priceChangedEvent =
            new ProductPriceChangedIntegrationEvent(1, decimal.One, decimal.MaxValue);*/

        // Achieving atomicity between original Catalog database operation and the IntegrationEventLog thanks to a local transaction
        // await _catalogIntegrationEventService.SaveEventAndCatalogContextChangesAsync(priceChangedEvent);

        // Publish through the Event Bus and mark the saved event as published
        // await _catalogIntegrationEventService.PublishThroughEventBusAsync(priceChangedEvent);
        await SendOkAsync(Response, cT);
    }
}