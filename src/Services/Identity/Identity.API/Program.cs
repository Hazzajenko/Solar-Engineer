using FastEndpoints;
using FastEndpoints.ClientGen;
using FluentValidation;
using Identity.API.Auth;
using Identity.API.Extensions;
using Identity.Application.Data;
using Identity.Application.Extensions.Application;
using Identity.Application.Extensions.ServiceCollection;
using Identity.Domain.Auth;
using Infrastructure.Data;
using Infrastructure.Logging;
using Infrastructure.OpenTelemetry;
using Infrastructure.SignalR;
using Infrastructure.Swagger;
using Infrastructure.Web;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Identity;
using NJsonSchema.CodeGeneration.TypeScript;
using NSwag;
using NSwag.CodeGeneration.TypeScript;

AppContext.SetSwitch("System.Net.Http.SocketsHttpHandler.Http2UnencryptedSupport", true);

var builder = WebApplication.CreateBuilder(
    new WebApplicationOptions { Args = args, ContentRootPath = Directory.GetCurrentDirectory() }
);

builder.ConfigureSerilog();

var config = builder.Configuration;
config.AddEnvironmentVariables("solarengineer_");

// builder.Services.InitMarten(config);
// var listenerQueues = new[] { "appuser-events" };
/*var listenerQueues = new ListenerQueue[]
{
    new("appuser-event-responses", true),
    new("projects-events")
};
var senderQueues = new[] { new SenderQueue("appuser-events", typeof(AppUserEvent)) };*/
/*builder.Host.InitWolverine(
    config,
    QueueConfig.ListenerQueues,
    QueueConfig.SenderQueues,
    typeof(IIdentityApplicationAssemblyMarker).Assembly
);*/

// builder.Host.InitIdentityWolverine(config);

builder.Services.InitOpenTelemetry(config);

/*builder.Logging.AddOpenTelemetry(loggerOptions =>
{
    loggerOptions.IncludeFormattedMessage = true;
    loggerOptions.IncludeScopes = true;
    loggerOptions.ParseStateValues = true;
    loggerOptions.AddOtlpExporter(options => options.Endpoint = new Uri("http://localhost:4317"));
});*/

builder.Services.AddApplicationServices(config);
builder.Services.AddValidatorsFromAssemblyContaining<Program>();
builder.Services.AddIdentityServices(config);
builder.Services.InitAuthentication(config);
builder.Services.InitAuthorization(config);
builder.Services.AddScoped<ApiKeyAuthFilter>();

// builder.Services.AddAuthServices(config);
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
/*builder.Services.InitDbContextWithWolverine<IdentityContext>(
    config,
    builder.Environment,
    "Identity.Application"
);*/

builder.Services.InitCors("corsPolicy");

builder.Services.AddFastEndpoints();
// builder.Services.AddFastEndpoints(options => { options.SourceGeneratorDiscoveredTypes = DiscoveredTypes.All; });
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

/*
builder.Services.AddSwaggerDoc(settings =>
    {
        settings.DocumentName = "Identity API v1";
        settings.Title = "Identity API";
        settings.Version = "v1";
        settings.AddAuth(
            "ApiKey",
            new OpenApiSecurityScheme
            {
                Name = AuthConstants.ApiKeyHeaderName,
                In = OpenApiSecurityApiKeyLocation.Header,
                Type = OpenApiSecuritySchemeType.ApiKey
            }
        );
    }
);
*/


var app = builder.Build();

// app.ConfigurePipeline();
app.ConfigurePipeline();

app.MapCSharpClientEndpoint(
    "/cs-client",
    "Identity API v1",
    s =>
    {
        s.ClassName = "ApiClient";
        s.CSharpGeneratorSettings.Namespace = "My Namespace";
        // s.
    }
);

app.MapTypeScriptClientEndpoint(
    "/ts-client",
    "Identity API v1",
    s =>
    {
        s.ClassName = "AuthService";
        s.TypeScriptGeneratorSettings.Namespace = "My Namespace";
        s.Template = TypeScriptTemplate.Angular;
        s.TypeScriptGeneratorSettings.TypeStyle = TypeScriptTypeStyle.Interface;
        s.ConfigurationClass = "AuthConfig";
        s.TypeScriptGeneratorSettings.TypeScriptVersion = 4.1m;
        s.PromiseType = PromiseType.Promise;
        s.InjectionTokenType = InjectionTokenType.InjectionToken;
        s.RxJsVersion = 6.6m;
        // s.BaseUrlTokenName = string.Empty;
        s.UseGetBaseUrlMethod = false;
        // s.
        // s.TypeScriptGeneratorSettings.GenerateOptionalParameters = true;
        // s.ConfigurationClassLocation = TypeScriptGeneratorSettings.ConfigurationClassLocationType.Global;
        // s.CodeGeneratorSettings.CodeGenerator = new TypeScriptClientGenerator(s.TypeScriptGeneratorSettings);
        // s.InjectionTokenType = ;
        // s.ClassName
    }
);

AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

var loginEndpoints = app.MapGroup("login");

loginEndpoints.MapGet(
    "/google",
    (SignInManager<AppUser> signInManager) =>
    {
        var provider = "google";
        var redirectUrl = "/?authorize=true";
        // var redirectUrl = "http://localhost:4200/?authorize=true";
        var properties = signInManager.ConfigureExternalAuthenticationProperties(
            provider,
            redirectUrl
        );
        properties.AllowRefresh = true;
        return Results.Challenge(properties, new List<string> { "google" });
    }
);
// var redirectUrl = "https://solarengineer.net/?authorize=true";

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