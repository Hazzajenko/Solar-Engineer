﻿using Identity.API.Data;
using Identity.API.Entities;
using Microsoft.AspNetCore.Identity;

namespace Identity.API.Extensions;

public static class IdentityExtensions
{
    public static IServiceCollection InitIdentityServer(this IServiceCollection services,
        IConfiguration config, IWebHostEnvironment env)
    {
        services.AddIdentity<AppUser, IdentityRole<Guid>>(config =>
            {
                config.Password.RequiredLength = 6;
                config.Password.RequireDigit = false;
                config.Password.RequireNonAlphanumeric = false;
                config.Password.RequireUppercase = false;
            })
            .AddEntityFrameworkStores<IdentityContext>()
            .AddDefaultTokenProviders();

        var identityServerBuilder = services.AddIdentityServer(options =>
            {
                options.Events.RaiseErrorEvents = true;
                options.Events.RaiseInformationEvents = true;
                options.Events.RaiseFailureEvents = true;
                options.Events.RaiseSuccessEvents = true;
                options.LicenseKey = config["IdentityKey"];
            })
            .AddInMemoryIdentityResources(InMemoryConfiguration.IdentityResources)
            .AddInMemoryApiResources(InMemoryConfiguration.ApiResources)
            .AddInMemoryApiScopes(InMemoryConfiguration.ApiScopes)
            .AddInMemoryClients(InMemoryConfiguration.Clients)
            .AddAspNetIdentity<AppUser>()
            .AddResourceOwnerValidator<UserValidator>();

        // if (env.IsDevelopment()) identityServerBuilder.AddDeveloperSigningCredential();

        return services;
    }
}