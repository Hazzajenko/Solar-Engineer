using Identity.Application.Data.UnitOfWork;
using Identity.Application.Repositories.AppUsers;
using Identity.Application.Services.Jwt;
using Identity.Application.Settings;
using Identity.SignalR.Services;
using Infrastructure.Services;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace Identity.Application.Extensions.ServiceCollection;

public static class ServiceExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services,
        IConfiguration config, IWebHostEnvironment environment)
    {
        // services.Configure<QueueSettings>(config.GetSection("Queues"));
        services.AddSingleton<ConnectionsService>();
        services.AddScoped<IIdentityUnitOfWork, IdentityUnitOfWork>();
        services.AddScoped<IAppUserRepository, AppUserRepository>();
        // services.AddScoped<IImagesService, ImagesService>();
        services.AddSingleton<IDateTimeProvider, DateTimeProvider>();

        if (environment.IsDevelopment())
            services.Configure<JwtSettings>(config.GetSection("Jwt"));
        /*else
            services.Configure<JwtSettings>(new 
            {
                Key = jwtKey,
                Issuer = "https://solarengineer.app",
                Audience = "https://api.solarengineer.app"
            });*/

        // services.Configure<JwtSettings>(config.GetSection("Jwt"));
        /*services.Configure<JwtSettings>(new JwtSettings
        {
            Issuer = 21
        });*/
        services.AddSingleton<IJwtTokenGenerator, JwtTokenGenerator>();
        services.Configure<StorageSettings>(config.GetSection("Azure:Storage"));


        services.AddMediator(options => { options.ServiceLifetime = ServiceLifetime.Transient; });
// config.
        services.InitMassTransit(environment);

        // services.UseWolverine();

        return services;
    }
}