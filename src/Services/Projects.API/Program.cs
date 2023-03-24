using FastEndpoints;
using FastEndpoints.Swagger;
using Infrastructure.Authentication;
using Infrastructure.Data;
using Infrastructure.Logging;
using Infrastructure.Web;
using Microsoft.AspNetCore.HttpOverrides;
using Projects.Application.Data;
using Projects.Application.Data.Bogus;
using Projects.Application.Extensions;

var builder = WebApplication.CreateBuilder(
    new WebApplicationOptions { Args = args, ContentRootPath = Directory.GetCurrentDirectory() }
);

// var webHost = WebHost.CreateDefaultBuilder(args)
/*.UseStartup<Startup>()*/
// ;

// builder.RegisterSerilog();
builder.ConfigureSerilog();

var config = builder.Configuration;
config.AddEnvironmentVariables("solarengineer_");
builder.Host.InitWolverine();

/*builder.Services.AddMediator(options => { options.ServiceLifetime = ServiceLifetime.Transient; });*/
builder.Services.AddApplicationServices(config);

// Register(typeof(IUserIdProvider), () => new HubsUserIdProvider());
// builder.WebHost.
// GlobalHost.DependencyResolver.Register(typeof(IUserIdProvider), () => new MyIdProvider());
// GlobalHost;
// GlobalHost.DependencyResolver.Register(typeof(IUserIdProvider), () => new HubsUserIdProvider());
builder.Services.ConfigureJwtAuthentication(config);
builder.Services.AddAuthorization();

// builder.Services.InitDbContext<ProjectsContext>(config, builder.Environment);
builder.Services.InitDbContext<ProjectsContext>(
    config,
    builder.Environment,
    "Projects.Application"
);

builder.Services.ConfigureSignalRWithRedis(builder.Environment);

/*builder.Services
    .AddSignalR(options =>
    {
        options.DisableImplicitFromServicesParameters = true;
        if (builder.Environment.IsDevelopment())
            options.EnableDetailedErrors = true;
        options.AddFilter<HubLoggerFilter>();
    })
    .AddStackExchangeRedis(
        "localhost",
        options => { options.Configuration.ChannelPrefix = "SolarEngineerApp"; }
    );*/

// BogusGenerators.InitBogusData();

// options.AddFilter<CustomFilter>();
/*builder.Services.AddSignalR(options =>
{
    options.DisableImplicitFromServicesParameters = true;
    // options.
    if (builder.Environment.IsDevelopment()) options.EnableDetailedErrors = true;
}).AddStackExchangeRedis("localhost", options => {
    options.Configuration.ChannelPrefix = "SolarEngineerApp";
});*/

builder.Services.InitCors("corsPolicy");

// builder.Services.AddFastEndpoints(options => { options.SourceGeneratorDiscoveredTypes = DiscoveredTypes.All; });
builder.Services.AddFastEndpoints(options => { options.SourceGeneratorDiscoveredTypes = DiscoveredTypes.All; });

builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
});

builder.Services.AddSwaggerDoc();

var app = builder.Build();

app.ConfigurePipeline();

/*app.Use(
    async (context, next) =>
    {
        // Connection: RemoteIp
        app.Logger.LogInformation(
            "Request RemoteIp: {RemoteIpAddress}",
            context.Connection.RemoteIpAddress
        );

        await next(context);
    }
);*/

AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
// BogusGenerators.InitBogusData();
app.Run();