using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace Identity.API.Extensions;

public static class AddDb
{
    public static IServiceCollection AddDbContext<T>(
        this IServiceCollection services,
        IConfiguration config,
        IWebHostEnvironment env
    ) where T : DbContext
    {
        services.AddDbContext<T>(options =>
        {
            var connectionString = GetConnectionString(config, env);

            options.UseNpgsql(connectionString);
        });

        return services;
    }

    private static string GetConnectionString(IConfiguration config, IWebHostEnvironment env)
    {
        if (env.IsProduction()) return BuildPostgresConnectionString();

        return config.GetConnectionString("DefaultConnection") ??
               throw new ArgumentNullException(nameof(GetConnectionString));
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
        return Environment.GetEnvironmentVariable(name) ?? throw new ArgumentNullException(nameof(name));
    }
}