using FastEndpoints;
using FluentValidation;
using Identity.API.Auth;
using Identity.API.Extensions;
using Identity.Application.Data;
using Identity.Application.Extensions.Application;
using Identity.Application.Extensions.ServiceCollection;
using Identity.Domain;
using Infrastructure.Authentication;
using Infrastructure.Data;
using Infrastructure.Logging;
using Infrastructure.OpenTelemetry;
using Infrastructure.SignalR;
using Infrastructure.Swagger;
using Infrastructure.Web;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Identity;
using NSwag;

// AppContext.SetSwitch("System.Net.Http.SocketsHttpHandler.Http2UnencryptedSupport", true);

var builder = WebApplication.CreateBuilder(
    new WebApplicationOptions { Args = args, ContentRootPath = Directory.GetCurrentDirectory() }
);

builder.ConfigureSerilog();
var config = builder.Configuration;
config.AddEnvironmentVariables("solarengineer_");

var environment = builder.Environment;
builder.Services.InitOpenTelemetry(config);

builder.Services.AddHealthChecks();
var jwtSettings = await config.GetJwtSettings(environment);
builder.Services.AddApplicationServices(config, environment, jwtSettings);
builder.Services.AddValidatorsFromAssemblyContaining<Program>();
builder.Services.AddIdentityServices(config);
builder.Services.InitAuthentication(config, environment, jwtSettings);
builder.Services.InitAuthorization(config);
builder.Services.AddScoped<ApiKeyAuthFilter>();

builder.Services.ConfigureSignalRWithRedis(builder.Environment);

builder.Services.InitDbContext<IdentityContext>(
    config,
    builder.Environment,
    "Identity.Application"
);
builder.Services.InitCors("corsPolicy");

builder.Services.AddFastEndpoints();

/*builder.Services.AddJsonOptions(options =>
{
    options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
});*/
builder.Services.AddHttpClient(
    "DockerHub",
    httpClient =>
    {
        var baseUrl = config.GetValue<string>("DockerHub:ApiBaseUrl");
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

var app = builder.Build();
app.ConfigurePipeline();
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

var loginEndpoints = app.MapGroup("login");

loginEndpoints.MapGet(
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
);

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

await app.RunAsync();
