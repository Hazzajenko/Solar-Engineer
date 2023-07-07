using System.Text.Json.Serialization;
using FastEndpoints;
using Infrastructure.Authentication;
using Infrastructure.Data;
using Infrastructure.Health;
using Infrastructure.Logging;
using Infrastructure.OpenTelemetry;
using Infrastructure.Swagger;
using Infrastructure.Web;
using Microsoft.AspNetCore.HttpOverrides;
using Projects.Application.Configuration;
using Projects.Application.Data;
using Projects.Application.Extensions;

using Microsoft.AspNetCore.SignalR;
using Projects.Application.HubFilters;
using Projects.Contracts.Data;
using Projects.SignalR.Hubs;

var builder = WebApplication.CreateBuilder(
    new WebApplicationOptions { Args = args, ContentRootPath = Directory.GetCurrentDirectory() }
);
builder.ConfigureSerilog();

var config = builder.Configuration;
config.AddEnvironmentVariables("solarengineer_");
var environment = builder.Environment;

builder.Services.InitOpenTelemetry(config, environment);

builder.Services.InitHealthChecks(config, environment);
builder.Services.AddCoreServices(environment);

// builder.Services.AddApplicationServices(config, environment);

// var jwtKey = await environment.GetSymmetricSecurityKey(config);
var jwtSettings = await config.GetJwtSettings(environment);

builder.Services.ConfigureJwtAuthentication(config, jwtSettings);
builder.Services.AddAuthorization();

builder.Services.InitDbContext<ProjectsContext>(config, environment, "Projects.Application");

// builder.Services.ConfigureSignalRWithRedis(
//     environment,
//     options =>
//     {
//         options.PayloadSerializerOptions.Converters.Add(new ProjectTemplateKeyConverter());
//     },
//     new List<JsonConverter> { new ProjectTemplateKeyConverter() }
// );
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

var app = builder.Build();

app.ConfigurePipeline();
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
app.Run();
