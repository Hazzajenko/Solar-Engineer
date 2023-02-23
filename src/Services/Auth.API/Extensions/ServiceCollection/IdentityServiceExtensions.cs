using Auth.API.Data;
using Auth.API.Entities;
using Microsoft.AspNetCore.Identity;

namespace Auth.API.Extensions.ServiceCollection;

public static class IdentityServiceExtensions
{
    public static IServiceCollection AddIdentityServices(
        this IServiceCollection services,
        IConfiguration config
    )
    {
        services.AddIdentity<AuthUser, AppRole>(config =>
            {
                // config.SignIn.RequireConfirmedEmail = true;
            })
            .AddRoleManager<RoleManager<AppRole>>()
            .AddSignInManager<SignInManager<AuthUser>>()
            .AddRoleValidator<RoleValidator<AppRole>>()
            .AddEntityFrameworkStores<AuthContext>()
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