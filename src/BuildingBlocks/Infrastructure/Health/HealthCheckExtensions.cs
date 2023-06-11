using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace Infrastructure.Health;

public static class HealthCheckExtensions
{
    public static IServiceCollection InitHealthChecks(
        this IServiceCollection services,
        IConfiguration config,
        IWebHostEnvironment env,
        SignalRHubHealthCheck? signalRHubHealthCheck = null
    )
    {
        var npgSqlConnectionString = GetPostgresConnectionString(config, env);
        var redisConnectionString = GetRedisConnectionString(config, env);
        var rabbitMqConnectionString = GetRabbitMqConnectionString(config, env);

        var healthChecksBuilder = services
            .AddHealthChecks()
            .AddNpgSql(npgSqlConnectionString)
            .AddRedis(redisConnectionString)
            .AddRabbitMQ(rabbitMqConnectionString, HealthStatus.Degraded);

        if (signalRHubHealthCheck is not null)
            healthChecksBuilder.AddSignalRHub(
                signalRHubHealthCheck.Url,
                signalRHubHealthCheck.Name
            );

        services.AddHealthChecksUI().AddInMemoryStorage();

        return services;
    }

    public record SignalRHubHealthCheck(string Url, string Name);

    /*public class SignalRHubHealthCheck : IHealthCheck
    {
        private readonly string _url;
        private readonly string _hubName;

        public SignalRHubHealthCheck(string url, string hubName)
        {
            _url = url;
            _hubName = hubName;
        }

        public async Task<HealthCheckResult> CheckHealthAsync(
            HealthCheckContext context,
            CancellationToken cancellationToken = default
        )
        {
            try
            {
                var state = await _hubConnection.InvokeAsync<string>("GetState", cancellationToken);
                return state == "Connected"
                    ? HealthCheckResult.Healthy("The hub is connected.")
                    : HealthCheckResult.Unhealthy("The hub is not connected.");
            }
            catch (Exception e)
            {
                return HealthCheckResult.Unhealthy("The hub is not connected.");
            }
        }
    }*/
}
