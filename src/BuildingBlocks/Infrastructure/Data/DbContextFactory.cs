using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Npgsql;
using Serilog;
using Wolverine.EntityFrameworkCore;

namespace Infrastructure.Data;

public static class DbContextFactory
{
    public static IServiceCollection InitDbContext<T>(
        this IServiceCollection services,
        IConfiguration? config = null,
        IWebHostEnvironment? env = null,
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

            var connectionString = GetConnectionString(config, env);

            if (migrationsAssembly != null)
                options.UseNpgsql(connectionString, x => x.MigrationsAssembly(migrationsAssembly));
            else
                options.UseNpgsql(connectionString);
        });

        return services;
    }

    public static IServiceCollection InitDbContextWithWolverine<T>(
        this IServiceCollection services,
        IConfiguration? config = null,
        IWebHostEnvironment? env = null,
        string? migrationsAssembly = null,
        string? inputConnectionString = null
    )
        where T : DbContext
    {
        services.AddDbContextWithWolverineIntegration<T>(options =>
        {
            if (inputConnectionString is not null)
            {
                options.UseNpgsql(inputConnectionString);
                Log.Logger.Information("Using input connection string");
                return;
            }

            ArgumentNullException.ThrowIfNull(config);
            ArgumentNullException.ThrowIfNull(env);

            var connectionString = GetConnectionString(config, env);

            if (migrationsAssembly != null)
                options.UseNpgsql(connectionString, x => x.MigrationsAssembly(migrationsAssembly));
            else
                options.UseNpgsql(connectionString);
        });

        return services;
    }

    private static string GetConnectionString(IConfiguration config, IWebHostEnvironment env)
    {
        if (env.IsProduction())
            return BuildPostgresConnectionString();

        return config.GetConnectionString("PostgresConnection")
               ?? throw new ArgumentNullException(nameof(GetConnectionString));
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

    private static string GetEnvironmentVariable(string name)
    {
        return Environment.GetEnvironmentVariable(name)
               ?? throw new ArgumentNullException(nameof(name));
    }
}