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
using Polly;
using RabbitMQ.Client;
using StackExchange.Redis;

namespace Identity.API.Tests.Integration;

public class ApiWebFactoryWithRabbitMq
    : WebApplicationFactory<IIdentityApiAssemblyMarker>,
        IAsyncLifetime
{
    private readonly IContainer _dbContainer = new ContainerBuilder()
        .WithName($"postgres-test-container-{Guid.NewGuid()}")
        .WithImage("postgres:latest")
        .WithEnvironment("POSTGRES_USER", "postgres")
        .WithEnvironment("POSTGRES_PASSWORD", "postgres")
        .WithEnvironment("POSTGRES_DB", "testdb")
        .WithPortBinding(5432, true)
        .WithWaitStrategy(Wait.ForUnixContainer().UntilPortIsAvailable(5432))
        .Build();

    private readonly IContainer _rabbitMqContainer = new ContainerBuilder()
        .WithName($"rabbitmq-test-container-{Guid.NewGuid()}")
        .WithImage("rabbitmq:3-management")
        .WithEnvironment("RABBITMQ_DEFAULT_USER", "guest")
        .WithEnvironment("RABBITMQ_DEFAULT_PASS", "guest")
        .WithPortBinding(5672, true)
        .WithPortBinding(15672, true)
        .WithWaitStrategy(Wait.ForUnixContainer().UntilPortIsAvailable(5672))
        .Build();

    public async Task InitializeAsync()
    {
        await _dbContainer.StartAsync();
        await _rabbitMqContainer.StartAsync();
    }

    public new async Task DisposeAsync()
    {
        await _dbContainer.DisposeAsync();
        await _rabbitMqContainer.DisposeAsync();
        await base.DisposeAsync();
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        Environment.SetEnvironmentVariable("IS_TEST_ENVIRONMENT", "true");
        Environment.SetEnvironmentVariable("IS_RABBITMQ_ENABLED", "true");
        Environment.SetEnvironmentVariable("TEST_RABBITMQ_HOST", _rabbitMqContainer.Hostname);
        Environment.SetEnvironmentVariable(
            "TEST_RABBITMQ_PORT",
            _rabbitMqContainer.GetMappedPublicPort(5672).ToString()
        );

        builder.ConfigureLogging(logging => logging.ClearProviders());

        builder.ConfigureTestServices(services =>
        {
            ServiceDescriptor? dbDescriptor = services.SingleOrDefault(
                d => d.ServiceType == typeof(DbContextOptions<IdentityContext>)
            );

            services.Remove(dbDescriptor!);

            services.AddSingleton<IDateTimeProvider, DateTimeProvider>();
            services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();
            var hostName = _dbContainer.Hostname;
            var mappedPort = _dbContainer.GetMappedPublicPort(5432);
            var dbConnection =
                $"Server={hostName};Port={mappedPort};Database=testdb;User ID=postgres;Password=postgres;";
            services.AddDbContext<IdentityContext>(options =>
            {
                options.UseNpgsql(dbConnection);
            });

            ServiceProvider serviceProvider = services.BuildServiceProvider();

            using IServiceScope scope = serviceProvider.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<IdentityContext>();
            db.Database.Migrate();
        });
    }
}
