using FastEndpoints;
using FastEndpoints.Swagger;
using Infrastructure.Logging.Serilog;
using Infrastructure.Web;
using Microsoft.AspNetCore.HttpOverrides;
using Projects.API.Extensions.Application;

var builder = WebApplication.CreateBuilder(
    new WebApplicationOptions { Args = args, ContentRootPath = Directory.GetCurrentDirectory() }
);

builder.RegisterSerilog();

var config = builder.Configuration;
config.AddEnvironmentVariables("solarengineer_");

builder.Services.AddApplicationServices(config);

builder.Services.InitCors("corsPolicy");

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