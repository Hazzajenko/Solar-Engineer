using System.Text.Json;
using System.Text.Json.Serialization;
using Auth.API.Data;
using Auth.API.Domain;
using Auth.API.Extensions.ServiceCollection;
using FastEndpoints.Swagger;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Serilog;


// var builder = WebApplication.CreateBuilder(args);
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

// builder.Services.AddClassesMatchingInterfaces(nameof(Auth.API));
builder.Services.AddApplicationServices(config);
builder.Services.AddAppServices();
builder.Services.AddIdentityServices(config);
builder.Services.AddOAuth(config);
// builder.Services.AddAuthorization();
builder.Services.AddDbContext<AuthContext>(config, builder.Environment);

const string corsPolicy = "CorsPolicy";
builder.Services.AddCors(options =>
{
    options.AddPolicy(
        corsPolicy,
        policy =>
            policy
                .WithOrigins(
                    "http://localhost:4200",
                    "http://127.0.0.1:4200",
                    "https://localhost:4200",
                    "https://127.0.0.1:4200"
                )
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials()
    );
});


/*builder.WebHost.ConfigureKestrel(options =>
{
    options.AddServerHeader = false;
    options.AllowSynchronousIO = false;
});*/


// builder.Host.UseConsoleLifetime(options => options.SuppressStatusMessages = true);


// builder.Services.AddAuthentication();
// builder.Services.AddAuthorization();


builder.Services.AddFastEndpoints(options => { options.SourceGeneratorDiscoveredTypes = DiscoveredTypes.All; });
// builder.Services.AddCookieAuth(TimeSpan.FromMinutes(10));

builder.Services.AddSwaggerDoc();

/*builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders =
        ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
});*/
// builder.Environment.

var app = builder.Build();

// app.UseForwardedHeaders();

if (app.Environment.IsDevelopment()) app.UseDefaultExceptionHandler();


app.UseSerilogRequestLogging();

// app.UseForwardedHeaders();

app.UseCors(corsPolicy);
app.UseHttpsRedirection();
/*app.UseForwardedHeaders(
    new ForwardedHeadersOptions
    {
        ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
    }
);*/


app.UseAuthentication();
// app.UseAuthorization();

app.MapGet("github", () => Results.Challenge(
    new AuthenticationProperties
    {
        RedirectUri = "http://localhost:4200/"
    }, new List<string> { "github" }));

app.MapGet("google2", () => Results.Challenge(
    new AuthenticationProperties
    {
        RedirectUri = "http://localhost:4200/"
    }, new List<string> { "google" }));

app.MapGet("/data", (HttpContext ctx) =>
{
    ctx.GetTokenAsync("access_token");
    var cookies = ctx.Request.Cookies;
    var headerCookies = ctx.Request.Headers.Cookie;
    return ctx.User.Claims.Select(x => new { x.Type, x.Value }).ToList();
});

app.UseFastEndpoints(options =>
{
    // options.Errors.ResponseBuilder = (errors, _) => errors.ToResponse();
    options.Errors.StatusCode = StatusCodes.Status422UnprocessableEntity;
    options.Serializer.Options.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    options.Serializer.Options.ReferenceHandler = ReferenceHandler.IgnoreCycles;
});

// app.UseSpa(x => { x.UseProxyToSpaDevelopmentServer("http://localhost:4200"); });

if (app.Environment.IsDevelopment())
{
    app.UseOpenApi();
    app.UseSwaggerUi3(x => x.ConfigureDefaults());
}

AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;
try
{
    var context = services.GetRequiredService<AuthContext>();
    var userManager = services.GetRequiredService<UserManager<AppUser>>();
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