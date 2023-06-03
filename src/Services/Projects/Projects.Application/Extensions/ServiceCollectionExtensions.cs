using System.Reflection;
using Infrastructure.SignalR;
using Mapster;
using MapsterMapper;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Projects.Application.Data.UnitOfWork;
using Projects.Application.Repositories.AppUserProjects;
using Projects.Application.Repositories.Projects;
using Projects.Application.Repositories.ProjectUsers;
using Projects.Application.Services.Strings;

namespace Projects.Application.Extensions;

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
        services.AddScoped<IProjectUsersRepository, ProjectUsersRepository>();
        services.AddMediator(options => { options.ServiceLifetime = ServiceLifetime.Transient; });
        // services.InitMassTransit();
        // services.AddAutoMapper(typeof(Program));
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