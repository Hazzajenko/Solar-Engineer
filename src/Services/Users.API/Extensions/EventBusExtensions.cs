﻿using EventBus.Abstractions;
using Users.API.Events;

namespace Users.API.Extensions;

public static class EventBusExtensions
{
    public static IApplicationBuilder ConfigureEventBus(
        this IApplicationBuilder app
    )
    {
        var eventBus = app.ApplicationServices.GetRequiredService<IEventBus>();

        eventBus.Subscribe<ProductPriceChangedIntegrationEvent, ProductPriceChangedIntegrationEventHandler>();
        eventBus.Subscribe<OrderStartedIntegrationEvent, OrderStartedIntegrationEventHandler>();

        return app;
    }
}