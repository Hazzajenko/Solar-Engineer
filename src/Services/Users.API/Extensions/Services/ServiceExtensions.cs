using FluentValidation;
using Infrastructure.Grpc;
using Microsoft.EntityFrameworkCore;
using Users.API.Data;
using Users.API.Grpc;
using Users.API.Repositories.UserConnections;
using Users.API.Repositories.UserLinks;
using Users.API.Repositories.Users;

namespace Users.API.Extensions.Services;

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
        services.AddScoped<IConnectionsUnitOfWork, ConnectionsUnitOfWork>();
        services.AddScoped<IUserConnectionsRepository, UserConnectionsRepository>();
        services.AddValidatorsFromAssemblyContaining<IApplicationMarker>(ServiceLifetime.Singleton);

        services.InitMassTransit();
        
        services.AddDbContext<ConnectionsContext>(o => o.UseInMemoryDatabase("Connections"));

        return services;
    }
}