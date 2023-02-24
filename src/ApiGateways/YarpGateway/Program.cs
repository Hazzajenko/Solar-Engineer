using Serilog;
using YarpGateway.Extensions.Application;
using YarpGateway.Extensions.Services;

var builder = WebApplication.CreateBuilder(
    new WebApplicationOptions { Args = args, ContentRootPath = Directory.GetCurrentDirectory() }
);

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

builder.Services.InitServiceCollection(config);

var app = builder.Build();

app.ConfigurePipeline();

app.MapGet("/", () => "Hello World!");

app.Run();