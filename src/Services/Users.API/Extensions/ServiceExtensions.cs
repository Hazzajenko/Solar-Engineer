// using Auth.API.Events;

// using DotNetCore.EntityFrameworkCore;

// using EventBus.Extensions;
using Infrastructure.Grpc;
using MassTransit;
using Users.API.Consumers;
using Users.API.Data;
// using Users.API.Events;
using Users.API.Grpc;
using Users.API.Repositories;
using Users.API.Repositories.UserLinks;
using Users.API.Repositories.Users;

namespace Users.API.Extensions;

public static class ServiceExtensions
{
    public static IServiceCollection AddAppServices(
        this IServiceCollection services,
        IConfiguration config
    )
    {
        services.AddTransient<GrpcExceptionInterceptor>();
        services.AddScoped<IAuthGrpcService, AuthGrpcService>();
        services.AddScoped<IUsersUnitOfWork, UsersUnitOfWork>();
        services.AddScoped<IUserLinksRepository, UserLinksRepository>();
        services.AddScoped<IUsersRepository, UsersRepository>();
        
        services.InitMassTransit();

        return services;
    }

}