using System.Reflection;
using FastEndpoints.Swagger;
using Infrastructure.Logging;
using Infrastructure.Web;
using Microsoft.AspNetCore.HttpOverrides;

var builder = WebApplication.CreateBuilder(
    new WebApplicationOptions { Args = args, ContentRootPath = Directory.GetCurrentDirectory() }
);

builder.ConfigureSerilog();
var config = builder.Configuration;
config.AddEnvironmentVariables("solarengineer_");

var entryAssembly = Assembly.GetEntryAssembly();
ArgumentNullException.ThrowIfNull(entryAssembly);

builder.Services.InitCors("corsPolicy");

// builder.Services.AddFastEndpoints(options => { options.SourceGeneratorDiscoveredTypes = DiscoveredTypes.All; });
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
});

builder.Services.AddSwaggerDoc();

var app = builder.Build();
app.Run();