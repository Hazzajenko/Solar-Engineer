using System.Net.Http.Headers;
using Auth.API.Settings;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace Auth.API.Extensions.ServiceCollection;

public static class ApplicationServiceExtensions
{
    public static IServiceCollection AddApplicationServices(
        this IServiceCollection services,
        IConfiguration config
    )
    {
        var domain = $"https://{config["Auth0:Domain"]}/";

        services.AddHttpClient(
            "Auth0",
            httpClient =>
            {
                httpClient.BaseAddress = new Uri(
                    domain ?? throw new InvalidOperationException("Please specify Auth0:Domain!")
                );

                httpClient.DefaultRequestHeaders.Accept.Add(
                    new MediaTypeWithQualityHeaderValue("application/json")
                );
            }
        );
        // services.AddScoped<IHttpClientFactoryService, HttpClientFactoryFactoryService>();

        services.AddMediator(options => { options.ServiceLifetime = ServiceLifetime.Transient; });

        services.Configure<AuthSettings>(config.GetSection("AuthSettings"));




        /*
        services.AddDbContext<AuthContext>(options =>
        {
            string connectionString = GetConnectionString(config, env);

            options.UseNpgsql(connectionString);
        });*/

        return services;
    }

    public static IServiceCollection AddDbContext<T>(
        this IServiceCollection services,
        IConfiguration config,
        IWebHostEnvironment env
    ) where T : DbContext
    {
        services.AddDbContext<T>(options =>
        {
            string connectionString = GetConnectionString(config, env);

            options.UseNpgsql(connectionString);
        });

        return services;
    }

    private static string GetConnectionString(          IConfiguration config ,     IWebHostEnvironment env)
    {
        if (env.IsProduction())
        {
            return BuildPostgresConnectionString();
        }

        return config.GetConnectionString("PostgresConnection") ?? throw new ArgumentNullException(nameof(GetConnectionString));
        
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