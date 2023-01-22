﻿using MassTransit;

namespace dotnetapi;

// public record Ord

internal class SubmitOrderConsumer :
    IConsumer<AccountConsumer>
{
    private readonly ILogger<AccountConsumer> _logger;

    public SubmitOrderConsumer(ILogger<AccountConsumer> logger)
    {
        _logger = logger;
    }

    /*public async Task Consume(ConsumeContext<SubmitOrder> context)
    {
        _logger.LogInformation("Order Submitted: {OrderId}", context.Message.OrderId);

        await context.Publish<OrderSubmitted>(new
        {
            context.Message.OrderId
        });
    }*/

    public async Task Consume(ConsumeContext<AccountConsumer> context)
    {
        _logger.LogInformation("Order Submitted: {OrderId}", context.Message);

        await context.Publish<UpdateAccount>(new
        {
            context.Message
        });
    }
}

internal class SubmitOrderConsumerDefinition :
    ConsumerDefinition<SubmitOrderConsumer>
{
    public SubmitOrderConsumerDefinition()
    {
        // override the default endpoint name
        EndpointName = "order-service";

        // limit the number of messages consumed concurrently
        // this applies to the consumer only, not the endpoint
        ConcurrentMessageLimit = 8;
    }

    protected override void ConfigureConsumer(IReceiveEndpointConfigurator endpointConfigurator,
        IConsumerConfigurator<SubmitOrderConsumer> consumerConfigurator)
    {
        // configure message retry with millisecond intervals
        endpointConfigurator.UseMessageRetry(r => r.Intervals(100, 200, 500, 800, 1000));

        // use the outbox to prevent duplicate events from being published
        endpointConfigurator.UseInMemoryOutbox();
    }
}