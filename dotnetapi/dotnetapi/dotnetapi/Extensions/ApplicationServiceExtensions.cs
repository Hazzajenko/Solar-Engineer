using dotnetapi.Data;
using dotnetapi.Services.Auth;
using dotnetapi.Services.Cache;
using dotnetapi.Services.Links;
using dotnetapi.Services.Panels;
using dotnetapi.Services.Paths;
using dotnetapi.Services.Projects;
using dotnetapi.Services.SignalR;
using dotnetapi.Services.Strings;
using dotnetapi.Services.Users;
using dotnetapi.SignalR;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace dotnetapi.Extensions;

public static class ApplicationServiceExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
    {
        services.AddSingleton<ConnectionsTracker>();
        services.AddSingleton<IUserIdProvider, NameUserIdProvider>();
        services.AddSingleton<IConnectionsService, ConnectionsService>();

        services.AddScoped<ICacheService, CacheService>();

        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IUsersService, UsersService>();
        services.AddScoped<IUsersRepository, UsersRepository>();
        services.AddScoped<IProjectsService, ProjectsService>();
        services.AddScoped<IProjectsRepository, ProjectsRepository>();
        services.AddScoped<IStringsService, StringsService>();
        services.AddScoped<IStringsRepository, StringsRepository>();
        services.AddScoped<IPanelsService, PanelsService>();
        services.AddScoped<IPanelsRepository, PanelsRepository>();
        services.AddScoped<IPanelLinksService, PanelLinksService>();
        services.AddScoped<IPanelLinksRepository, PanelLinksRepository>();
        services.AddScoped<IPathsService, PathsService>();
        services.AddScoped<IPathsRepository, PathsRepository>();


        services.AddDbContext<DataContext>(options =>
        {
            string? connStr;
            // connStr = config.GetConnectionString("PostgresConnection") ?? throw new InvalidOperationException();

            /*options.UseNpgsql(
                "Server=localhost;Port=5432;Database=solardotnetbackend;User ID=postgres;Password=password;");*/

            var connectionString = config.GetConnectionString("PostgresConnection");
            Console.WriteLine(connectionString);
            /*var databaseUrl =
                "Server=postgres-solarengineer-do-user-11630140-0.b.db.ondigitalocean.com;Port=25060;Database=defaultdb;User ID=doadmin;Password=AVNS_eIDAV_jplzcmCdgCWV6;";
            // var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL");
            Console.WriteLine(databaseUrl);*/
            var Host = Environment.GetEnvironmentVariable("DATABASE_HOST")!;
            connStr = string.IsNullOrEmpty(Host) ? connectionString : BuildConnectionString(Host);
            Console.WriteLine(connStr);
            options.UseNpgsql(connStr);

            /*var env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
            Console.WriteLine(env);

            string connStr;
            if (env == "Development")
            {
                connStr = config.GetConnectionString("PostgresConnection") ?? throw new InvalidOperationException();
            }
            else
            {
                var connUrl = Environment.GetEnvironmentVariable("DATABASE_URL");

                connUrl = connUrl!.Replace("postgres://", string.Empty);
                var pgUserPass = connUrl.Split("@")[0];
                var pgHostPortDb = connUrl.Split("@")[1];
                var pgHostPort = pgHostPortDb.Split("/")[0];
                var pgDb = pgHostPortDb.Split("/")[1];
                var pgUser = pgUserPass.Split(":")[0];
                var pgPass = pgUserPass.Split(":")[1];
                var pgHost = pgHostPort.Split(":")[0];
                var pgPort = pgHostPort.Split(":")[1];

                connStr =
                    $"Server={pgHost};Port={pgPort};User Id={pgUser};Password={pgPass};Database={pgDb}; SSL Mode=Require; Trust Server Certificate=true";
            }

            options.UseNpgsql(connStr);*/
        });

        services.AddDbContext<InMemoryDatabase>
            (o => o.UseInMemoryDatabase("InMemoryDatabase"));

        return services;
    }

    private static string? BuildConnectionString(string databaseUrl)
    {
        /*var databaseUri = new Uri(databaseUrl);
        Console.WriteLine(databaseUri);
        var userInfo = databaseUri.UserInfo.Split(':');
        Console.WriteLine(userInfo);*/
        var host = Environment.GetEnvironmentVariable("DATABASE_HOST")!;
        Console.WriteLine(host);
        var port = Environment.GetEnvironmentVariable("DATABASE_PORT")!;
        Console.WriteLine(port);
        var username = Environment.GetEnvironmentVariable("DATABASE_USERNAME")!;
        Console.WriteLine(username);
        var password = Environment.GetEnvironmentVariable("DATABASE_PASSWORD")!;
        Console.WriteLine(password);
        var database = Environment.GetEnvironmentVariable("DATABASE_DATABASE")!;
        Console.WriteLine(database);

        var builder = new NpgsqlConnectionStringBuilder
        {
            Host = host,
            Port = int.Parse(port),
            Username = username,
            Password = password,
            Database = database,
            SslMode = SslMode.Require,
            TrustServerCertificate = true
        };
        Console.WriteLine(builder);
        return builder.ToString();
    }
}