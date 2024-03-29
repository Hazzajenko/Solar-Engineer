﻿using System.Reflection;
using Infrastructure.SignalR;
using Mapster;
using MapsterMapper;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Projects.Application.Data.UnitOfWork;
using Projects.Application.Repositories.AppUserProjects;
using Projects.Application.Repositories.Projects;

namespace Projects.Application.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplicationServices(
        this IServiceCollection services,
        IConfiguration config,
        IWebHostEnvironment environment
    )
    {
        services.AddSingleton<IUserIdProvider, HubsUserIdProvider>();
        services.AddScoped<IProjectsUnitOfWork, ProjectsUnitOfWork>();
        services.AddScoped<IProjectsRepository, ProjectsRepository>();
        services.AddScoped<IAppUserProjectsRepository, AppUserProjectsRepository>();
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
