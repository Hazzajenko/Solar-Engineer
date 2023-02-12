using Infrastructure.Web;
using Microsoft.AspNetCore.HttpOverrides;
using Ocelot.DependencyInjection;
using Ocelot.Middleware;
using Serilog;

var builder = WebApplication.CreateBuilder(
    new WebApplicationOptions { Args = args, ContentRootPath = Directory.GetCurrentDirectory() }
);
builder.Configuration.AddJsonFile("ocelot.json", optional: false, reloadOnChange: true);
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

const string corsPolicy = "CorsPolicy";
builder.Services.InitCors(corsPolicy);

builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders =
        ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
});

builder.Services.AddOcelot(builder.Configuration);
var app = builder.Build();
app.UseForwardedHeaders();
app.UseSerilogRequestLogging();

app.UseCors(corsPolicy);

app.UseRouting();
await app.UseOcelot();
// app.MapGet("/", () => "Hello World!");

app.Run();