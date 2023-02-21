// using Auth.API.Events;

// using DotNetCore.EntityFrameworkCore;

// using EventBus.Extensions;

using FluentValidation;
using Infrastructure.Grpc;
using Users.API.Data;
using Users.API.Grpc;
using Users.API.Repositories.UserLinks;
using Users.API.Repositories.Users;
// using Users.API.Events;

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
        services.AddValidatorsFromAssemblyContaining<IApplicationMarker>(ServiceLifetime.Singleton);

        services.InitMassTransit();

        return services;
    }
}