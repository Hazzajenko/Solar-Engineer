using FastEndpoints;
using Infrastructure.Authentication;
using Infrastructure.Data;
using Infrastructure.Health;
using Infrastructure.Logging;
using Infrastructure.OpenTelemetry;
using Infrastructure.SignalR;
using Infrastructure.Swagger;
using Infrastructure.Web;
using Messages.Application.Data;
using Messages.Application.Extensions;
using Microsoft.AspNetCore.HttpOverrides;

var builder = WebApplication.CreateBuilder(
    new WebApplicationOptions { Args = args, ContentRootPath = Directory.GetCurrentDirectory() }
);

builder.ConfigureSerilog();

var config = builder.Configuration;
config.AddEnvironmentVariables("solarengineer_");
var environment = builder.Environment;
builder.Services.InitOpenTelemetry(config, environment);

builder.Services.InitHealthChecks(config, environment);
builder.Services.AddApplicationServices(config);
var jwtSettings = await config.GetJwtSettings(environment);
builder.Services.ConfigureJwtAuthentication(config, jwtSettings);

builder.Services.AddAuthorization();
builder.Services.InitDbContext<MessagesContext>(config, environment, "Messages.Application");

builder.Services.ConfigureSignalRWithRedis(builder.Environment);
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
