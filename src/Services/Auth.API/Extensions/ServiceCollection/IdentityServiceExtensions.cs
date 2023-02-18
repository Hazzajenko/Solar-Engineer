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
        /*services.AddIdentity<AppUser, IdentityRole<Guid>>(config =>
            {
                config.Password.RequiredLength = 6;
                config.Password.RequireDigit = false;
                config.Password.RequireNonAlphanumeric = false;
                config.Password.RequireUppercase = false;
            })
            .AddEntityFrameworkStores<AuthContext>()
            .AddDefaultTokenProviders();*/

        services
            .AddIdentityCore<AuthUser>(opt => { opt.Password.RequireNonAlphanumeric = false; })
            .AddRoles<AppRole>()
            .AddRoleManager<RoleManager<AppRole>>()
            .AddSignInManager<SignInManager<AuthUser>>()
            .AddRoleValidator<RoleValidator<AppRole>>()
            .AddEntityFrameworkStores<AuthContext>();

        return services;
    }
}