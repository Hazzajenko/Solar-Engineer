using Identity.Application.Data;
using Identity.Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Identity.Application.Extensions;

public static class IdentityServiceExtensions
{
    public static IServiceCollection AddIdentityServices(
        this IServiceCollection services,
        IConfiguration config
    )
    {
        services
            .AddIdentity<AppUser, AppRole>()
            .AddRoleManager<RoleManager<AppRole>>()
            .AddSignInManager<SignInManager<AppUser>>()
            .AddRoleValidator<RoleValidator<AppRole>>()
            .AddEntityFrameworkStores<IdentityContext>()
            .AddDefaultTokenProviders();

        return services;
    }
}
