using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Npgsql;

namespace Infrastructure.Extensions;

public static class DataExtensions
{
    private static string PostgresConnectionString { get; set; } = string.Empty;

    public static string GetPostgresConnectionString(IConfiguration config, IWebHostEnvironment env)
    {
        if (PostgresConnectionString != string.Empty)
            return PostgresConnectionString;
        var connectionString = env.IsDevelopment()
            ? config.GetConnectionString("PostgresConnection")!
            : BuildPostgresConnectionString();
        ArgumentNullException.ThrowIfNull(connectionString);
        PostgresConnectionString = connectionString;
        return connectionString;
    }

    public static string GetRabbitMqConnectionString(IConfiguration config, IWebHostEnvironment env)
    {
        var rabbitMqConnectionString = env.IsDevelopment() ? "localhost" : "rabbitmq";
        ArgumentNullException.ThrowIfNull(rabbitMqConnectionString);
        return rabbitMqConnectionString;
    }

    public static string GetRedisConnectionString(IConfiguration config, IWebHostEnvironment env)
    {
        var redisConnectionString = env.IsDevelopment() ? "localhost" : "redis";
        return redisConnectionString;
    }

    private static string BuildPostgresConnectionString()
    {
        var builder = new NpgsqlConnectionStringBuilder
        {
            Host = GetEnvironmentVariable("DATABASE_HOST"),
            Port = int.Parse(GetEnvironmentVariable("DATABASE_PORT")),
            Username = GetEnvironmentVariable("DATABASE_USERNAME"),
            Password = GetEnvironmentVariable("DATABASE_PASSWORD"),
            Database = GetEnvironmentVariable("DATABASE_DATABASE"),
            SslMode = SslMode.Require,
            TrustServerCertificate = true
        };

        return builder.ToString();
    }

    public static string GetEnvironmentVariable(string name)
    {
        return Environment.GetEnvironmentVariable(name)
            ?? throw new ArgumentNullException(nameof(name));
    }
}
