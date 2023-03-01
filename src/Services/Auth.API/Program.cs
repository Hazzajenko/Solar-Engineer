using System.Reflection;
using Auth.API.Data;
using Auth.API.Entities;
using Auth.API.Extensions.Application;
using Auth.API.Extensions.ServiceCollection;
using FastEndpoints;
using FastEndpoints.Swagger;
using Infrastructure.Data;
using Infrastructure.Logging;
using Infrastructure.Web;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(
    new WebApplicationOptions { Args = args, ContentRootPath = Directory.GetCurrentDirectory() }
);

// var appName = builder.RegisterSerilog();
builder.ConfigureSerilog();

var config = builder.Configuration;
config.AddEnvironmentVariables("solarengineer_");

// var appName = builder.RegisterSerilog();

var entryAssembly = Assembly.GetEntryAssembly();
ArgumentNullException.ThrowIfNull(entryAssembly);
builder.Services.AddApplicationServices(config, entryAssembly);
builder.Services.AddIdentityServices(config);
builder.Services.AddAuthServices(config);

// builder.Services.AddOptions();
// builder.Services.AddInfrastructureServices();

/*
var redisConn = ConnectionMultiplexer.Connect("localhost");
builder.Services.AddDataProtection()
    .PersistKeysToStackExchangeRedis(redisConn)
    .SetApplicationName("solarEngineer");*/

builder.Services.InitDbContext<AuthContext>(config, builder.Environment);

builder.Services.InitCors("corsPolicy");

builder.Services.AddFastEndpoints(options => { options.SourceGeneratorDiscoveredTypes = DiscoveredTypes.All; });
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;

    options.KnownNetworks.Clear();
    options.KnownProxies.Clear();
});

builder.Services.AddSwaggerDoc();

builder.Services.AddGrpc();

var app = builder.Build();

app.ConfigurePipeline();

AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;
try
{
    var context = services.GetRequiredService<AuthContext>();
    var userManager = services.GetRequiredService<UserManager<AuthUser>>();
    var roleManager = services.GetRequiredService<RoleManager<AppRole>>();
    await context.Database.MigrateAsync();
    await AuthContextSeed.SeedAll(userManager, roleManager);
}
catch (Exception ex)
{
    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "An error occurred during migration");
}

await app.RunAsync();