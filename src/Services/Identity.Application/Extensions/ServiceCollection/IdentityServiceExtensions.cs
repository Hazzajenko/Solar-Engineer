using Identity.Application.Data;
using Identity.Application.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Identity.Application.Extensions.ServiceCollection;

public static class IdentityServiceExtensions
{
    public static IServiceCollection AddIdentityServices(
        this IServiceCollection services,
        IConfiguration config
    )
    {
        services
            .AddIdentity<AppUser, AppRole>(config =>
            {
                // config.SignIn.RequireConfirmedEmail = true;
            })
            .AddRoleManager<RoleManager<AppRole>>()
            .AddSignInManager<SignInManager<AppUser>>()
            .AddRoleValidator<RoleValidator<AppRole>>()
            .AddEntityFrameworkStores<IdentityContext>()
            .AddDefaultTokenProviders();

        /*services
            .AddIdentityCore<AuthUser>(opt => { opt.Password.RequireNonAlphanumeric = false; })
            .AddRoles<AppRole>()
            .AddRoleManager<RoleManager<AppRole>>()
            .AddSignInManager<SignInManager<AuthUser>>()
            .AddRoleValidator<RoleValidator<AppRole>>()
            // .Add
            .AddEntityFrameworkStores<AuthContext>();*/

        return services;
    }
}