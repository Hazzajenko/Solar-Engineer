using FastEndpoints;
using FluentValidation;
using Identity.API.Auth;
using Identity.API.Extensions;
using Identity.Application.Data;
using Identity.Application.Extensions;
using Identity.Application.HubFilters;
using Identity.Application.OpenTelemetry;
using Identity.Domain;
using Identity.SignalR.Hubs;
using Infrastructure.Authentication;
using Infrastructure.Data;
using Infrastructure.Health;
using Infrastructure.Logging;
using Infrastructure.OpenTelemetry;
using Infrastructure.SignalR;
using Infrastructure.Swagger;
using Infrastructure.Web;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using NSwag;

var builder = WebApplication.CreateBuilder(
    new WebApplicationOptions { Args = args, ContentRootPath = Directory.GetCurrentDirectory() }
);

builder.ConfigureSerilog();
var config = builder.Configuration;
config.AddEnvironmentVariables("solarengineer_");

var environment = builder.Environment;
builder.Services.InitOpenTelemetry(
    config,
    environment,
    new MeterServiceConfiguration(
        IdentityDiagnosticsConfig.ActivitySource,
        IdentityDiagnosticsConfig.Meter
    )
);

builder.Services.InitHealthChecks(config, environment);
var jwtSettings = await config.GetJwtSettings(environment);

/*builder.Services.AddJsonOptions(options =>
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve);*/

builder.Services.AddApplicationServices(config, environment, jwtSettings);
builder.Services.AddValidatorsFromAssemblyContaining<Program>();
builder.Services.AddIdentityServices(config);

// builder.Services.InitAuthenticationAuth0();

builder.Services.InitAuthentication(config, environment, jwtSettings);
builder.Services.InitAuthorization(config);
builder.Services.AddScoped<ApiKeyAuthFilter>();

// builder.Services.ConfigureSignalRWithRedis(builder.Environment);

builder.Services
    .AddSignalR(options =>
    {
        options.DisableImplicitFromServicesParameters = true;
        if (environment.IsDevelopment())
            options.EnableDetailedErrors = true;
    })
    .AddHubOptions<UsersHub>(options =>
    {
        options.AddFilter<UsersHubFilter>();
    })
    .InitStackExchangeRedis(builder.Services, environment);

// builder.Services.AddSingleton<UsersHubFilter>();

builder.Services.InitDbContext<IdentityContext>(
    config,
    builder.Environment,
    "Identity.Application"
);
builder.Services.InitCors();

builder.Services.AddFastEndpoints();

builder.Services.AddHttpClient(
    "DockerHub",
    httpClient =>
    {
        var baseUrl = environment.IsDevelopment()
            ? config.GetValue<string>("DockerHub:ApiBaseUrl")
            : GetEnvironmentVariable("DOCKER_HUB_API_BASE_URL");
        ArgumentNullException.ThrowIfNull(baseUrl);
        httpClient.BaseAddress = new Uri(baseUrl);
    }
);

builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
});

builder.Services.InitSwaggerDocs(
    config,
    new AddAuthSchemeRequest[]
    {
        new(
            "ApiKey",
            new OpenApiSecurityScheme
            {
                Name = AuthConstants.ApiKeyHeaderName,
                In = OpenApiSecurityApiKeyLocation.Header,
                Type = OpenApiSecuritySchemeType.ApiKey
            },
            new[] { "Identity.API" }
        )
    }
);

WebApplication app = builder.Build();

// MethodTimeLogger.Logger = app.Logger;
app.ConfigurePipeline();
app.UseOpenTelemetryPrometheusScrapingEndpoint();
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);


RouteGroupBuilder loginEndpoints = app.MapGroup("login");


/*loginEndpoints.MapGet(
    "/github",
    (SignInManager<AppUser> signInManager) =>
    {
        var provider = "github";
        var redirectUrl = "/?authorize=true";
        var properties = signInManager.ConfigureExternalAuthenticationProperties(
            provider,
            redirectUrl
        );
        properties.AllowRefresh = true;
        return Results.Challenge(properties, new List<string> { "github" });
    }
);*/

loginEndpoints.MapGet(
    "/google",
    (SignInManager<AppUser> signInManager) =>
    {
        var provider = "google";
        var redirectUrl = "/?authorize=true";
        var properties = signInManager.ConfigureExternalAuthenticationProperties(
            provider,
            redirectUrl
        );
        properties.AllowRefresh = true;
        return Results.Challenge(properties, new List<string> { "google" });
    }
);

loginEndpoints.MapGet(
    "/microsoft",
    (SignInManager<AppUser> signInManager) =>
    {
        const string provider = "microsoft";
        const string redirectUrl = "/?authorize=true";
        AuthenticationProperties properties =
            signInManager.ConfigureExternalAuthenticationProperties(provider, redirectUrl);
        properties.AllowRefresh = true;
        return Results.Challenge(properties, new List<string> { "microsoft" });
    }
);

await app.RunAsync();
