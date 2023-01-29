using CloudinaryDotNet;
using dotnetapi.Data;
using dotnetapi.Features.Friends.Services;
using dotnetapi.Features.GroupChats.Services;
using dotnetapi.Features.Messages.Services;
using dotnetapi.Features.Notifications.Services;
using dotnetapi.Services.Auth;
using dotnetapi.Services.Cache;
using dotnetapi.Services.Links;
using dotnetapi.Services.Panels;
using dotnetapi.Services.Paths;
using dotnetapi.Services.Projects;
using dotnetapi.Services.SignalR;
using dotnetapi.Services.Strings;
using dotnetapi.Settings;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace dotnetapi.Extensions;

public static class ApplicationServiceExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
    {
        services.AddMediator(options => { options.ServiceLifetime = ServiceLifetime.Transient; });

        // services.AddMediator();
        services.Configure<CloudinarySettings>(config.GetSection("CloudinarySettings"));
        var cloudName = config.GetValue<string>("CloudinarySettings:CloudName");
        var apiKey = config.GetValue<string>("CloudinarySettings:ApiKey");
        var apiSecret = config.GetValue<string>("CloudinarySettings:ApiSecret");

        if (new[] { cloudName, apiKey, apiSecret }.Any(string.IsNullOrWhiteSpace))
            throw new ArgumentException("Please specify Cloudinary account details!");

        services.AddSingleton(new Cloudinary(new Account(cloudName, apiKey, apiSecret)));

        services.AddSingleton<IUserIdProvider, NameUserIdProvider>();
        services.AddSingleton<IConnectionsService, ConnectionsService>();

        services.AddScoped<IDataContext>(provider => provider.GetService<DataContext>()!);

        services.AddScoped<ICacheService, CacheService>();
        services.AddScoped<INotificationsService, NotificationsService>();
        services.AddScoped<INotificationsRepository, NotificationsRepository>();
        services.AddScoped<IMessagesService, MessagesService>();
        services.AddScoped<IMessagesRepository, MessagesRepository>();
        services.AddScoped<IGroupChatsRepository, GroupChatsRepository>();

        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IFriendsService, FriendsService>();
        services.AddScoped<IFriendsRepository, FriendsRepository>();
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
            // options.EnableSensitiveDataLogging();
            string? connStr;

            var connectionString = config.GetConnectionString("PostgresConnection");
            // Console.WriteLine(connectionString);

            var host = Environment.GetEnvironmentVariable("DATABASE_HOST")!;
            connStr = string.IsNullOrEmpty(host) ? connectionString : BuildConnectionString();
            // Console.WriteLine(connStr);
            options.UseNpgsql(connStr);
        });

        services.AddDbContext<InMemoryDatabase>
            (o => o.UseInMemoryDatabase("InMemoryDatabase"));

        return services;
    }

    private static string? BuildConnectionString()
    {
        var host = Environment.GetEnvironmentVariable("DATABASE_HOST")!;
        var port = Environment.GetEnvironmentVariable("DATABASE_PORT")!;
        var username = Environment.GetEnvironmentVariable("DATABASE_USERNAME")!;
        var password = Environment.GetEnvironmentVariable("DATABASE_PASSWORD")!;
        var database = Environment.GetEnvironmentVariable("DATABASE_DATABASE")!;
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
        // Console.WriteLine(builder);
        return builder.ToString();
    }
}