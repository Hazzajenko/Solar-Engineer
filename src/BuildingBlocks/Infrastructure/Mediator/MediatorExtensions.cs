using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure.Mediator;

public static class MediatorExtensions
{
    public static IServiceCollection InitMediator(this IServiceCollection services)
    {
        services.AddMediator(options => { options.ServiceLifetime = ServiceLifetime.Transient; });
        return services;
    }
}