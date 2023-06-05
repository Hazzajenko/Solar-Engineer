using FastEndpoints;
using Infrastructure.Authentication;
using Infrastructure.Data;
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

builder.Services.InitOpenTelemetry(config);

builder.Services.AddApplicationServices(config);
builder.Services.ConfigureJwtAuthentication(config);
builder.Services.AddAuthorization();

builder.Services.InitDbContext<ProjectsContext>(
    config,
    builder.Environment,
    "Projects.Application"
);

builder.Services.ConfigureSignalRWithRedis(builder.Environment);
builder.Services.InitCors("corsPolicy");

builder.Services.AddFastEndpoints();

builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
});

builder.Services.InitSwaggerDocs(config);

var app = builder.Build();

app.ConfigurePipeline();
app.Run();