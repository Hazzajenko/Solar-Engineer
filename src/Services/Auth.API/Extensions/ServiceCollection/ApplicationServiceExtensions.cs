using Auth.API.Data;
using Auth.API.Repositories;

namespace Auth.API.Extensions.ServiceCollection;

public static class ServiceExtensions
{
    public static IServiceCollection AddApplicationServices(
        this IServiceCollection services
    )
    {
        services.AddScoped<IAuthContext>(provider => provider.GetService<AuthContext>()!);
        // services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IAppUserRepository, AppUserRepository>();
        services.AddMediator(options => { options.ServiceLifetime = ServiceLifetime.Transient; });
        return services;
    }
}