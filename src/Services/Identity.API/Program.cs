using FastEndpoints;
using FastEndpoints.Swagger;
using Identity.Application.Data;
using Identity.Application.Extensions.Application;
using Identity.Application.Extensions.ServiceCollection;
using Infrastructure.Data;
using Infrastructure.Logging;
using Infrastructure.SignalR;
using Infrastructure.Web;
using Microsoft.AspNetCore.HttpOverrides;

var builder = WebApplication.CreateBuilder(
    new WebApplicationOptions { Args = args, ContentRootPath = Directory.GetCurrentDirectory() }
);

// var appName = builder.RegisterSerilog();
builder.ConfigureSerilog();

var config = builder.Configuration;
config.AddEnvironmentVariables("solarengineer_");

// var appName = builder.RegisterSerilog();

// var entryAssembly = Assembly.GetEntryAssembly();
// ArgumentNullException.ThrowIfNull(entryAssembly);
builder.Services.AddApplicationServices(config);
builder.Services.AddIdentityServices(config);
builder.Services.AddAuthServices(config);
builder.Services.ConfigureSignalRWithRedis(builder.Environment);

builder.Services.AddHttpClient(
    "Images",
    httpClient =>
    {
        // httpClient.BaseAddress = new Uri(config.GetValue<string>("GitHub:ApiBaseUrl"));
        /*httpClient.DefaultRequestHeaders.Add(
            HeaderNames.Accept, "application/vnd.github.v3+json");
        httpClient.DefaultRequestHeaders.Add(
            HeaderNames.UserAgent, $"Course-{Environment.MachineName}");*/
    }
);

builder.Services.InitDbContext<IdentityContext>(
    config,
    builder.Environment,
    "Identity.Application"
);

// builder.Services.InitDbContext<AuthContext>(config, builder.Environment);

builder.Services.InitCors("corsPolicy");

builder.Services.AddFastEndpoints(options => { options.SourceGeneratorDiscoveredTypes = DiscoveredTypes.All; });
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;

    // options.KnownNetworks.Clear();
    // options.KnownProxies.Clear();
});

builder.Services.AddSwaggerDoc();

// builder.Services.AddGrpc();

var app = builder.Build();

// app.ConfigurePipeline();
app.ConfigurePipeline();

AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
/*using var scope = app.Services.CreateScope();
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
}*/

await app.RunAsync();