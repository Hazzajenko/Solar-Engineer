using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Npgsql;
using Serilog;

namespace Infrastructure.Data;

/// <summary>
///     This class is used to initialize the DbContext.
///     It is called from the Program class.
///     It is also called from the Integration Tests.
/// </summary>
public static class DbContextFactory
{
    private const string DatabaseHost = "DATABASE_HOST";
    private const string DatabasePort = "DATABASE_PORT";
    private const string DatabaseUsername = "DATABASE_USERNAME";
    private const string DatabasePassword = "DATABASE_PASSWORD";
    private const string DatabaseDatabase = "DATABASE_DATABASE";

    /// <summary>
    ///     This method is used to initialize the DbContext.
    ///     It is called from the Program class.
    /// </summary>
    public static IServiceCollection InitDbContext<T>(
        this IServiceCollection services,
        IConfiguration config,
        IWebHostEnvironment env,
        string? migrationsAssembly = null,
        string? inputConnectionString = null
    )
        where T : DbContext
    {
        services.AddDbContext<T>(options =>
        {
            if (inputConnectionString is not null)
            {
                options.UseNpgsql(inputConnectionString);
                Log.Logger.Information("Using input connection string");
                return;
            }

            ArgumentNullException.ThrowIfNull(config);
            ArgumentNullException.ThrowIfNull(env);

            if (env.IsDevelopment())
            {
                options.EnableSensitiveDataLogging();
            }

            var connectionString = GetConnectionString(config, env);

            if (migrationsAssembly != null)
                options.UseNpgsql(connectionString, x => x.MigrationsAssembly(migrationsAssembly));
            else
                options.UseNpgsql(connectionString);
        });

        return services;
    }

    /// <summary>
    ///     This method is used to get the connection string.
    ///     It is called from the DbContextFactory class.
    /// </summary>
    private static string GetConnectionString(IConfiguration config, IWebHostEnvironment env)
    {
        if (env.IsProduction())
            return BuildPostgresConnectionString();

        return config.GetConnectionString("PostgresConnection")
            ?? throw new ArgumentNullException(nameof(GetConnectionString));
    }

    /// <summary>
    ///     This method is used to build the connection string.
    ///     It is called from the DbContextFactory class.
    /// </summary>
    private static string BuildPostgresConnectionString()
    {
        var builder = new NpgsqlConnectionStringBuilder
        {
            Host = GetEnvironmentVariable(DatabaseHost),
            Port = int.Parse(GetEnvironmentVariable(DatabasePort)),
            Username = GetEnvironmentVariable(DatabaseUsername),
            Password = GetEnvironmentVariable(DatabasePassword),
            Database = GetEnvironmentVariable(DatabaseDatabase),
            SslMode = SslMode.Require,
            TrustServerCertificate = true
        };

        return builder.ToString();
    }

    /// <summary>
    ///     This method is used to get the environment variable.
    ///     It is called from the DbContextFactory class.
    /// </summary>
    private static string GetEnvironmentVariable(string name)
    {
        return Environment.GetEnvironmentVariable(name)
            ?? throw new ArgumentNullException(nameof(name));
    }
}
