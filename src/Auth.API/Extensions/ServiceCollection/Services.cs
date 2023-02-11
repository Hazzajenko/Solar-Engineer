using Auth.API.Data;
using Auth.API.Repositories;
using Auth.API.Services;

namespace Auth.API.Extensions.ServiceCollection;


public static class Services
{
    public static IServiceCollection AddAppServices(
        this IServiceCollection services
    )
    {
        services.AddScoped<IAuthContext>(provider => provider.GetService<AuthContext>()!);
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IAppUserRepository, AppUserRepository>();
        return services;
    }
}