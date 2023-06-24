using System.Reflection;
using ApplicationCore.Interfaces;
using Infrastructure.Data;
using Infrastructure.SignalR;
using Mapster;
using MapsterMapper;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Projects.Application.Data;
using Projects.Application.Data.UnitOfWork;
using Projects.Application.Extensions;
using Projects.Application.Repositories.AppUserProjects;
using Projects.Application.Repositories.Projects;
using Projects.Application.Repositories.ProjectUsers;
using Projects.Domain.Entities;

namespace Projects.Application.Configuration;

public static class ConfigureCoreServices
{
    public static IServiceCollection AddCoreServices(
        this IServiceCollection services,
        IWebHostEnvironment environment
    )
    {
        services.AddScoped(
            typeof(IReadRepository<Project>),
            typeof(EfRepository<ProjectsContext, Project>)
        );
        services.AddScoped(
            typeof(IRepository<Project>),
            typeof(EfRepository<ProjectsContext, Project>)
        );

        services.AddSingleton<IUserIdProvider, HubsUserIdProvider>();
        services.AddScoped<IProjectsUnitOfWork, ProjectsUnitOfWork>();
        services.AddScoped<IProjectsRepository, ProjectsRepository>();
        services.AddScoped<IAppUserProjectsRepository, AppUserProjectsRepository>();
        services.AddScoped<IProjectUsersRepository, ProjectUsersRepository>();
        services.AddMediator(options =>
        {
            options.ServiceLifetime = ServiceLifetime.Transient;
        });
        services.InitMassTransit(environment);
        services.AddMappings();

        return services;
    }

    private static IServiceCollection AddMappings(this IServiceCollection services)
    {
        var config = TypeAdapterConfig.GlobalSettings;
        config.Scan(Assembly.GetExecutingAssembly());

        services.AddSingleton(config);
        services.AddScoped<IMapper, ServiceMapper>();
        return services;
    }
}
