using System.Reflection;
using FastEndpoints;
using Identity.API.Deprecated.Data;
using Identity.API.Deprecated.Extensions.Application;
using Identity.API.Deprecated.Extensions.Services;
using Infrastructure.Data;
using Infrastructure.Web;
using Microsoft.AspNetCore.HttpOverrides;
using Serilog;

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

// JwtSecurityTokenHandler.DefaultMapInboundClaims = false;
var entryAssembly = Assembly.GetEntryAssembly() ?? throw new ArgumentNullException(nameof(Assembly));
builder.Services.AddApplicationServices(config, entryAssembly);


builder.Services.InitDbContext<IdentityContext>(config, builder.Environment);
builder.Services.InitIdentityServer(config, builder.Environment);
builder.Services.InitIdentityAuthConfig(config, builder.Environment);

const string corsPolicy = "CorsPolicy";
builder.Services.InitCors(corsPolicy);

builder.Services.AddFastEndpoints();

builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders =
        ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
});
// Add services to the container.

// builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
// builder.Services.AddEndpointsApiExplorer();
// builder.Services.AddSwaggerGen();

var app = builder.Build();

app.ConfigurePipeline();

/*
app.UseForwardedHeaders();

app.UseSerilogRequestLogging();

app.UseCors(corsPolicy);
app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.UseFastEndpoints(options =>
{
    options.Endpoints.Configurator = ep => { ep.PreProcessors(Order.Before, new SecurityHeadersProcessor()); };
    options.Endpoints.RoutePrefix = "identity";
    options.Errors.StatusCode = StatusCodes.Status422UnprocessableEntity;
    options.Serializer.Options.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    options.Serializer.Options.ReferenceHandler = ReferenceHandler.IgnoreCycles;
});

app.UseIdentityServer();
IdentitySeeder.InitializeDatabase(app);

var loginEndpoints = app.MapGroup("identity/login");
var identityEndpoints = app.MapGroup("identity");

loginEndpoints.MapGet("/github", () => Results.Challenge(
    new AuthenticationProperties
    {
        RedirectUri = "http://localhost:4200/"
    }, new List<string> { "github" }));

loginEndpoints.MapGet("/google", () => Results.Challenge(
    new AuthenticationProperties
    {
        RedirectUri = "https://localhost:4200/"
    }, new List<string> { "google" }));

identityEndpoints.MapGet("/", (HttpContext ctx) =>
{
    ctx.GetTokenAsync("access_token");
    return ctx.User.Claims.Select(x => new { x.Type, x.Value }).ToList();
}).RequireAuthorization("ApiScope");


AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;
try
{
    var context = services.GetRequiredService<IdentityContext>();
    var userManager = services.GetRequiredService<UserManager<AppUser>>();
    await context.Database.MigrateAsync();
    await IdentitySeeder.SeedAll(userManager);
}
catch (Exception ex)
{
    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "An error occurred during migration");
}*/

app.Run();