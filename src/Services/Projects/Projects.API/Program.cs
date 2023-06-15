using FastEndpoints;
using Infrastructure.Authentication;
using Infrastructure.Data;
using Infrastructure.Health;
using Infrastructure.Logging;
using Infrastructure.OpenTelemetry;
using Infrastructure.Swagger;
using Infrastructure.Web;
using Microsoft.AspNetCore.HttpOverrides;
using Projects.Application.Data;
using Projects.Application.Extensions;

var builder = WebApplication.CreateBuilder(
    new WebApplicationOptions { Args = args, ContentRootPath = Directory.GetCurrentDirectory() }
);
builder.ConfigureSerilog();

var config = builder.Configuration;
config.AddEnvironmentVariables("solarengineer_");
var environment = builder.Environment;

builder.Services.InitOpenTelemetry(config, environment);

builder.Services.InitHealthChecks(config, environment);
builder.Services.AddApplicationServices(config, environment);

// var jwtKey = await environment.GetSymmetricSecurityKey(config);
var jwtSettings = await config.GetJwtSettings(environment);

builder.Services.ConfigureJwtAuthentication(config, jwtSettings);
builder.Services.AddAuthorization();

builder.Services.InitDbContext<ProjectsContext>(config, environment, "Projects.Application");

builder.Services.ConfigureSignalRWithRedis(environment);
builder.Services.InitCors("corsPolicy");

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
