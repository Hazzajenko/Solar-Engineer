namespace Infrastructure.Mediator;

/*public sealed record ErrorMessage(Exception Exception) : INotification;

public sealed record SuccessfulMessage : INotification;

public sealed class ErrorLoggerHandler<TMessage, TResponse> : IPipelineBehavior<TMessage, TResponse>
    where TMessage : IMessage
{
    private readonly ILogger<ErrorLoggerHandler<TMessage, TResponse>> _logger;
    private readonly IMediator _mediator;

    public ErrorLoggerHandler(ILogger<ErrorLoggerHandler<TMessage, TResponse>> logger, IMediator mediator)
    {
        _logger = logger;
        _mediator = mediator;
    }

    public async ValueTask<TResponse> Handle(TMessage message, CancellationToken cancellationToken,
        MessageHandlerDelegate<TMessage, TResponse> next)
    {
        try
        {
            var response = await next(message, cancellationToken);
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error handling message");
            await _mediator.Publish(new ErrorMessage(ex), cancellationToken);
            throw;
        }
    }
}*/