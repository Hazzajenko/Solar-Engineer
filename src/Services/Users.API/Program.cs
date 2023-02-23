using Auth.API;
using FastEndpoints;
using FastEndpoints.Swagger;
using Infrastructure.Config;
using Infrastructure.Data;
using Infrastructure.Grpc;
using Infrastructure.Logging.Serilog;
using Infrastructure.Web;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.Extensions.Options;
using Serilog;
using Users.API.Data;
using Users.API.Extensions;
using Users.API.Extensions.Application;
using Users.API.Extensions.Services;

// var builder = WebApplication.CreateBuilder(args);
var builder = WebApplication.CreateBuilder(
    new WebApplicationOptions { Args = args, ContentRootPath = Directory.GetCurrentDirectory() }
);
// var appName = builder.RegisterSerilog();

var config = builder.Configuration;
config.AddEnvironmentVariables("solarengineer_");

builder.Host.UseSerilog(
    (_, loggerConfig) =>
    {
        loggerConfig.WriteTo
            .Console()
            .ReadFrom.Configuration(
                config
            );
    }
);

builder.Services.AddMediator(options => { options.ServiceLifetime = ServiceLifetime.Transient; });
builder.Services.InitIdentityAuthUsers(config);

builder.Services.AddAppServices(config);

builder.Services.InitDbContext<UsersContext>(config, builder.Environment);
builder.Services.Configure<UrlsConfig>(config.GetSection("Urls"));

builder.Services.AddGrpcClient<AuthGrpc.AuthGrpcClient>((services, options) =>
{
    var grpcAuth = services.GetRequiredService<IOptions<UrlsConfig>>().Value.GrpcAuth;
    if (string.IsNullOrEmpty(grpcAuth)) grpcAuth = config["Urls:grpcAuth"]!;
    options.Address = new Uri(grpcAuth);
}).AddInterceptor<GrpcExceptionInterceptor>();

builder.Services.AddSignalR(options =>
{
    options.DisableImplicitFromServicesParameters = true;
    // options.
    if (builder.Environment.IsDevelopment()) options.EnableDetailedErrors = true;
}).AddStackExchangeRedis("localhost", options => {
    options.Configuration.ChannelPrefix = "SolarEngineerApp";
});


const string corsPolicy = "CorsPolicy";
builder.Services.InitCors(corsPolicy);

builder.Services.AddFastEndpoints(options => { options.SourceGeneratorDiscoveredTypes = DiscoveredTypes.All; });

builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders =
        ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
});

builder.Services.AddSwaggerDoc();


var app = builder.Build();

app.ConfigurePipeline();

AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

app.Run();