using System.Reflection;
using Infrastructure.SignalR;
using Mapster;
using MapsterMapper;
using Microsoft.AspNetCore.SignalR;
using Projects.API.Data;
using Projects.API.Repositories.AppUserProjects;
using Projects.API.Repositories.Projects;
using Projects.API.Services.Strings;

namespace Projects.API.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplicationServices(
        this IServiceCollection services,
        IConfiguration config
    )
    {
        services.AddSingleton<IUserIdProvider, HubsUserIdProvider>();
        services.AddScoped<IProjectsUnitOfWork, ProjectsUnitOfWork>();
        services.AddScoped<IProjectsRepository, ProjectsRepository>();
        services.AddScoped<IStringsService, StringsService>();
        services.AddScoped<IAppUserProjectsRepository, AppUserProjectsRepository>();
        services.AddMediator(options => { options.ServiceLifetime = ServiceLifetime.Transient; });
        services.AddAutoMapper(typeof(Program));
        services.AddMappings();
        // services.InitMediator();
        // services.AddSingleton(typeof(IPipelineBehavior<,>), typeof(ErrorLoggerHandler<,>));
        // services.AddJwtAuthentication(config);

        return services;
    }

    public static IServiceCollection AddMappings(this IServiceCollection services)
    {
        var config = TypeAdapterConfig.GlobalSettings;
        config.Scan(Assembly.GetExecutingAssembly());

        services.AddSingleton(config);
        services.AddScoped<IMapper, ServiceMapper>();
        return services;
    }
}