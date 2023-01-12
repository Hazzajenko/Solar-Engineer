﻿using dotnetapi.Data;
using dotnetapi.Repositories.Links;
using dotnetapi.Repositories.Panels;
using dotnetapi.Repositories.Paths;
using dotnetapi.Repositories.Projects;
using dotnetapi.Repositories.Strings;
using dotnetapi.Services.Auth;
using dotnetapi.Services.Links;
using dotnetapi.Services.Panels;
using dotnetapi.Services.Paths;
using dotnetapi.Services.Projects;
using dotnetapi.Services.Strings;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace dotnetapi.Extensions;

public static class ApplicationServiceExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
    {
        services.AddScoped<IAuthService, AuthService>();
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
            var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL");
            Console.WriteLine(databaseUrl);
            connStr = string.IsNullOrEmpty(databaseUrl) ? connectionString : BuildConnectionString(databaseUrl);
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
        return services;
    }

    private static string? BuildConnectionString(string databaseUrl)
    {
        var databaseUri = new Uri(databaseUrl);
        var userInfo = databaseUri.UserInfo.Split(':');
        var builder = new NpgsqlConnectionStringBuilder
        {
            Host = databaseUri.Host,
            Port = databaseUri.Port,
            Username = userInfo[0],
            Password = userInfo[1],
            Database = databaseUri.LocalPath.TrimStart('/'),
            SslMode = SslMode.Require,
            TrustServerCertificate = true
        };
        return builder.ToString();
    }
}