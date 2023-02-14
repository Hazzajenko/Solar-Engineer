using Auth.API.Data;
using Auth.API.Repositories;
using Auth.API.Services;
using Infrastructure.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace Auth.API.Extensions.ServiceCollection;

public static class ServiceExtensions
{
    public static IServiceCollection AddApplicationServices(
        this IServiceCollection services
    )
    {
        services.AddScoped<IAuthContext>(provider => provider.GetService<AuthContext>()!);
        // services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IAuthService, AuthService>();
        // services.AddScoped<ICustomUserManager, CustomUserManager>();
        // services.Replace(ServiceDescriptor.Scoped(typeof(UserManager<AppUser>), typeof(CustomUserManager)));
        services.AddScoped<IAppUserRepository, AppUserRepository>();
        services.AddMediator(options => { options.ServiceLifetime = ServiceLifetime.Transient; });
        return services;
    }
}