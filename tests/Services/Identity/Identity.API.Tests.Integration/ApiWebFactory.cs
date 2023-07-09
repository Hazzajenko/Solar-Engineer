using DotNet.Testcontainers.Builders;
using DotNet.Testcontainers.Containers;
using Identity.Application.Data;
using Identity.Application.Services.Jwt;
using Identity.Domain;
using Infrastructure.Data;
using Infrastructure.Services;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Logging;
using Npgsql;
using RabbitMQ.Client;
using StackExchange.Redis;

namespace Identity.API.Tests.Integration;

// We use the "IApiMarker" interface to reference our API project.
// We also implement the "IAsyncLifetime" interface to properly initialize and dispose of our used services.
public class ApiWebFactory : WebApplicationFactory<IIdentityApiAssemblyMarker>, IAsyncLifetime
{
    private readonly IContainer _dbContainer = new ContainerBuilder()
        .WithName("postgres-test-container")
        .WithImage("postgres:latest")
        .WithEnvironment("POSTGRES_USER", "postgres")
        .WithEnvironment("POSTGRES_PASSWORD", "postgres")
        .WithEnvironment("POSTGRES_DB", "testdb")
        .WithPortBinding(5555, 5432)
        .WithWaitStrategy(Wait.ForUnixContainer().UntilPortIsAvailable(5432))
        .Build();

    private readonly IContainer _rabbitMqContainer = new ContainerBuilder()
        .WithName("rabbitmq-test-container")
        .WithImage("rabbitmq:3-management")
        .WithEnvironment("RABBITMQ_DEFAULT_USER", "guest")
        .WithEnvironment("RABBITMQ_DEFAULT_PASS", "guest")
        .WithPortBinding(5672, 5672)
        .WithPortBinding(15672, 15672)
        .WithWaitStrategy(Wait.ForUnixContainer().UntilPortIsAvailable(5672))
        .Build();

    public async Task InitializeAsync()
    {
        await _dbContainer.StartAsync();
        await _rabbitMqContainer.StartAsync();
    }

    public new async Task DisposeAsync()
    {
        await _dbContainer.StopAsync();
        await _rabbitMqContainer.StopAsync();
        await _dbContainer.DisposeAsync();
        await _rabbitMqContainer.DisposeAsync();
        await base.DisposeAsync();
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        Environment.SetEnvironmentVariable("IS_TEST_ENVIRONMENT", "true");

        builder.ConfigureLogging(logging => logging.ClearProviders());

        builder.ConfigureTestServices(services =>
        {
            ServiceDescriptor? dbDescriptor = services.SingleOrDefault(
                d => d.ServiceType == typeof(DbContextOptions<IdentityContext>)
            );

            services.Remove(dbDescriptor!);

            services.AddSingleton<IDateTimeProvider, DateTimeProvider>();
            services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();

            const string dbConnection =
                "Server=localhost;Port=5555;Database=testdb;User ID=postgres;Password=postgres;";
            services.AddDbContext<IdentityContext>(options =>
            {
                options.UseNpgsql(dbConnection);
            });

            // Database migration logic goes here
            ServiceProvider serviceProvider = services.BuildServiceProvider();

            using (IServiceScope scope = serviceProvider.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<IdentityContext>();
                db.Database.Migrate();
            }
        });

        // using var serviceScope = getService.CreateScope();
        // var context = serviceScope.ServiceProvider.GetRequiredService<IdentityContext>();
        // var context = services.ServiceProvider.GetRequiredService<IdentityContext>();
        // await context.Database.MigrateAsync();
    }

    public async Task EnsureDatabaseMigratedAsync()
    {
        using IServiceScope serviceScope = Server.Host.Services.CreateScope();
        var context = serviceScope.ServiceProvider.GetRequiredService<IdentityContext>();
        await context.Database.MigrateAsync();
    }
}
