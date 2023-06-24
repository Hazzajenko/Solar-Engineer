using ApplicationCore.Extensions;
using Infrastructure.Extensions;
using Mediator;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Behaviours;

public sealed class LoggingBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    private readonly ILogger<LoggingBehavior<TRequest, TResponse>> _logger;

    public LoggingBehavior(ILogger<LoggingBehavior<TRequest, TResponse>> logger)
    {
        _logger = logger;
    }

    public async ValueTask<TResponse> Handle(
        TRequest message,
        CancellationToken cancellationToken,
        MessageHandlerDelegate<TRequest, TResponse> next
    )
    {
        _logger.LogInformation(
            "Handling command {CommandName} ({@Command})",
            message.GetGenericTypeName(),
            message
        );
        var response = await next(message, cancellationToken);
        _logger.LogInformation(
            "Command {CommandName} handled - response: {@Response}",
            message.GetGenericTypeName(),
            response
        );

        return response;
    }
}

public static class LoggingBehaviorExtensions
{
    public static IServiceCollection InitLoggingBehavior(this IServiceCollection services)
    {
        services.AddSingleton(typeof(LoggingBehavior<,>));
        return services;
    }
}


/*
using Mediator;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Behaviours;
public class LoggingBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse> where TRequest : IRequest<TResponse>
{
    private readonly ILogger<LoggingBehavior<TRequest, TResponse>> _logger;
    public LoggingBehavior(ILogger<LoggingBehavior<TRequest, TResponse>> logger) => _logger = logger;

    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Handling command {CommandName} ({@Command})", request.GetGenericTypeName(), request);
        var response = await next();
        _logger.LogInformation("Command {CommandName} handled - response: {@Response}", request.GetGenericTypeName(), response);

        return response;
    }
}
*/
