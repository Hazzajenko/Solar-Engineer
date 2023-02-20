using System.Reflection;
using Duende.IdentityServer.EntityFramework.Storage;
using Duende.IdentityServer.Services;
using Identity.API.Data;
using Identity.API.Entities;
using Identity.API.Services;
using Infrastructure.Extensions;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Identity.API.Extensions.Services;

public static class IdentityExtensions
{
    public static IServiceCollection InitIdentityServer(this IServiceCollection services,
        IConfiguration config, IWebHostEnvironment env)
    {
        services.AddIdentity<AppUser, IdentityRole<Guid>>(options =>
            {
                options.Password.RequiredLength = 6;
                options.Password.RequireDigit = false;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
            })
            .AddEntityFrameworkStores<IdentityContext>()
            .AddDefaultTokenProviders();

        var migrationsAssembly = typeof(Program).GetTypeInfo().Assembly.GetName().Name;
        var connectionString = DataExtensions.GetConnectionString(config, env);

        services.AddIdentityServer(options =>
            {
                options.Events.RaiseErrorEvents = true;
                options.Events.RaiseInformationEvents = true;
                options.Events.RaiseFailureEvents = true;
                options.Events.RaiseSuccessEvents = true;
                options.EmitStaticAudienceClaim = true;
                options.LicenseKey = config["IdentityKey"];
                options.Caching.ClientStoreExpiration = TimeSpan.FromMinutes(5);
                options.Caching.ResourceStoreExpiration = TimeSpan.FromMinutes(5);
            })
            .AddInMemoryCaching()
            /*.AddInMemoryIdentityResources(IdentityConfig.IdentityResources)
            .AddInMemoryApiResources(IdentityConfig.ApiResources)
            .AddInMemoryApiScopes(IdentityConfig.ApiScopes)
            .AddInMemoryClients(IdentityConfig.Clients)*/
            .AddResourceOwnerValidator<UserValidator>()
            .AddProfileService<CustomProfileService>()
            .AddAspNetIdentity<AppUser>()
            .AddCustomTokenRequestValidator<TransactionScopeTokenRequestValidator>().AddConfigurationStore(options =>
            {
                options.ConfigureDbContext = builder => builder.UseNpgsql(connectionString,
                    sqlOptions => { sqlOptions.MigrationsAssembly(migrationsAssembly); });
            })
            .AddConfigurationStoreCache()
            .AddOperationalStore(options =>
            {
                options.ConfigureDbContext = builder => builder.UseNpgsql(connectionString,
                    sqlOptions => { sqlOptions.MigrationsAssembly(migrationsAssembly); });
                options.EnableTokenCleanup = true;
                options.TokenCleanupInterval = 3600;
            });


        // services.AddScoped<IProfileService, CustomProfileService>();
        services.AddTransient<IProfileService, CustomProfileService>()
            ;

        services.AddOperationalDbContext(options =>
        {
            options.ConfigureDbContext = builder => builder.UseNpgsql(connectionString,
                sqlOptions => { sqlOptions.MigrationsAssembly(migrationsAssembly); });
        });
        services.AddConfigurationDbContext(options =>
        {
            options.ConfigureDbContext = builder => builder.UseNpgsql(connectionString,
                sqlOptions => { sqlOptions.MigrationsAssembly(migrationsAssembly); });
        });

        // if (env.IsDevelopment()) identityServerBuilder.AddDeveloperSigningCredential();

        return services;
    }
}