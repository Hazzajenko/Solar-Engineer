using System.Text.Json.Serialization;
using FastEndpoints;
using Infrastructure.Authentication;
using Infrastructure.Data;
using Infrastructure.Health;
using Infrastructure.Logging;
using Infrastructure.OpenTelemetry;
using Infrastructure.Settings;
using Infrastructure.Swagger;
using Infrastructure.Web;
using Microsoft.AspNetCore.HttpOverrides;
using Projects.Application.Configuration;
using Projects.Application.Data;
using Projects.Application.Extensions;

using Microsoft.AspNetCore.SignalR;
using Projects.Application.HubFilters;
using Projects.Application.OpenTelemetry;
using Projects.Contracts.Data;
using Projects.SignalR.Hubs;

var builder = WebApplication.CreateBuilder(
    new WebApplicationOptions { Args = args, ContentRootPath = Directory.GetCurrentDirectory() }
);
builder.ConfigureSerilog();

var config = builder.Configuration;
config.AddEnvironmentVariables("solarengineer_");
var environment = builder.Environment;

builder.Services.InitOpenTelemetry(
    config,
    environment,
    new MeterServiceConfiguration(
        ProjectsDiagnosticsConfig.ActivitySource,
        ProjectsDiagnosticsConfig.Meter
    )
);

builder.Services.InitHealthChecks(config, environment);
builder.Services.AddCoreServices(environment);

JwtSettings jwtSettings = await config.GetJwtSettings(environment);

builder.Services.ConfigureJwtAuthentication(config, jwtSettings);
builder.Services.AddAuthorization();

builder.Services.InitDbContext<ProjectsContext>(config, environment, "Projects.Application");

builder.Services
    .AddSignalR(options =>
    {
        options.DisableImplicitFromServicesParameters = true;
        if (environment.IsDevelopment())
            options.EnableDetailedErrors = true;
    })
    .AddHubOptions<ProjectsHub>(options =>
    {
        options.AddFilter<ProjectsHubFilter>();
    })
    .InitStackExchangeRedis(builder.Services, environment);
builder.Services.AddSingleton<ProjectsHubFilter>();

builder.Services.InitCors();

builder.Services.AddFastEndpoints();

builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
});

builder.Services.InitSwaggerDocs(config);

WebApplication app = builder.Build();

app.ConfigurePipeline();
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
app.Run();
