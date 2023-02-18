using System.Reflection;
using System.Text.Json;
using System.Text.Json.Serialization;
using FastEndpoints;
using Identity.API.Data;
using Identity.API.Entities;
using Identity.API.Extensions;
using Identity.API.Processors;
using Infrastructure.Data;
using Infrastructure.Web;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
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

/*builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders =
        ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
});*/
// Add services to the container.

// builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
// builder.Services.AddEndpointsApiExplorer();
// builder.Services.AddSwaggerGen();

var app = builder.Build();

// app.UseForwardedHeaders();
// Configure the HTTP request pipeline.
/*if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}*/

app.UseSerilogRequestLogging();

app.UseCors(corsPolicy);
app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.UseFastEndpoints(options =>
{
    // options.Errors.ResponseBuilder = (errors, _) => errors.ToResponse();
    options.Endpoints.Configurator = ep => { ep.PreProcessors(Order.Before, new SecurityHeadersProcessor()); };
    options.Endpoints.RoutePrefix = "identity";
    options.Errors.StatusCode = StatusCodes.Status422UnprocessableEntity;
    options.Serializer.Options.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    options.Serializer.Options.ReferenceHandler = ReferenceHandler.IgnoreCycles;
});

app.UseIdentityServer();

var loginEndpoints = app.MapGroup("identity/login");
var identityEndpoints = app.MapGroup("identity");

loginEndpoints.MapGet("/github", () => Results.Challenge(
    new AuthenticationProperties
    {
        RedirectUri = "http://localhost:4200/"
    }, new List<string> { "github" }));

// [DisableCors]
loginEndpoints.MapGet("/google", () => Results.Challenge(
    new AuthenticationProperties
    {
        RedirectUri = "https://localhost:4200/"
        // RedirectUri = "https://localhost:7222/auth/login/google"
        // RedirectUri = "https://localhost:7222/"
    }, new List<string> { "google" })); /*.RequireCors(x => x.);*/

identityEndpoints.MapGet("/", (HttpContext ctx) =>
{
    // Console.WriteLine(ctx.Request.Cookies.Count);
    ctx.GetTokenAsync("access_token");
    // ctx.User.GetT
    return ctx.User.Claims.Select(x => new { x.Type, x.Value }).ToList();
}).RequireAuthorization("ApiScope");


// app.MapControllers().RequireAuthorization("ApiScope");
// app.MapControllers();

AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;
try
{
    var context = services.GetRequiredService<IdentityContext>();
    var userManager = services.GetRequiredService<UserManager<AppUser>>();
    // var roleManager = services.GetRequiredService<RoleManager<AppRole>>();
    await context.Database.MigrateAsync();
    await IdentityContextSeed.SeedAll(userManager);
}
catch (Exception ex)
{
    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "An error occurred during migration");
}

app.Run();