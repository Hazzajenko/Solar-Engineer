using Users.API.Repositories;

namespace Users.API.Extensions;

public static class ServiceExtensions
{
    public static IServiceCollection AddAppServices(
        this IServiceCollection services
    )
    {
        services.AddScoped<IUserLinksRepository, UserLinksRepository>();
        return services;
    }
}