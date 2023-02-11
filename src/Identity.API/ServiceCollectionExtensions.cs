using Identity.API.Data;
using Identity.API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Identity.API;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddIdentityServerMan(this IServiceCollection services, IWebHostEnvironment env,
        ConfigurationManager config,
        string migrationsAssembly)
    {
        services.AddIdentity<ApplicationUser, IdentityRole<Guid>>(config =>
            {
                config.Password.RequiredLength = 6;
                config.Password.RequireDigit = false;
                config.Password.RequireNonAlphanumeric = false;
                config.Password.RequireUppercase = false;
            })
            .AddRoles<AppRole>()
            .AddRoleManager<RoleManager<AppRole>>()
            .AddSignInManager<SignInManager<ApplicationUser>>()
            .AddRoleValidator<RoleValidator<AppRole>>()
            .AddEntityFrameworkStores<IdentityContext>()
            .AddDefaultTokenProviders();


        // var migrationsAssembly = typeof(env).Assembly.GetName().Name;

        var connectionString = config.GetConnectionString("DefaultConnection");

        var identityServerBuilder = services.AddIdentityServer(options =>
            {
                options.Events.RaiseErrorEvents = true;
                options.Events.RaiseInformationEvents = true;
                options.Events.RaiseFailureEvents = true;
                options.Events.RaiseSuccessEvents = true;
            }).AddConfigurationStore(options => options.ConfigureDbContext = b => b.UseNpgsql(connectionString,
                opt => opt.MigrationsAssembly(migrationsAssembly)))
            .AddOperationalStore(options => options.ConfigureDbContext = b => b.UseNpgsql(connectionString,
                opt => opt.MigrationsAssembly(migrationsAssembly)))
            .AddInMemoryIdentityResources(InMemoryConfiguration.IdentityResources)
            .AddInMemoryApiResources(InMemoryConfiguration.ApiResources)
            .AddInMemoryApiScopes(InMemoryConfiguration.ApiScopes)
            .AddInMemoryClients(InMemoryConfiguration.Clients)
            .AddAspNetIdentity<ApplicationUser>() /*
            .AddResourceOwnerValidator<UserValidator>()*/;

        if (env.IsDevelopment()) identityServerBuilder.AddDeveloperSigningCredential();

        return services;
    }
}