using System.Reflection;
using System.Text.Json;
using System.Text.Json.Serialization;
using Auth.API.Data;
using Auth.API.Entities;
using Auth.API.Extensions.ServiceCollection;
using Auth.API.Services;
using FastEndpoints;
using FastEndpoints.Swagger;
using Infrastructure;
using Infrastructure.Authentication;
using Infrastructure.Data;
using Infrastructure.Logging.Serilog;
using Infrastructure.Web;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Serilog;

var builder = WebApplication.CreateBuilder(
    new WebApplicationOptions { Args = args, ContentRootPath = Directory.GetCurrentDirectory() }
);
// var appName = builder.RegisterSerilog();

var config = builder.Configuration;
config.AddEnvironmentVariables("solarengineer_");

var appName = builder.RegisterSerilog();


/*builder.Host.UseSerilog(
    (_, loggerConfig) =>
    {
        loggerConfig.WriteTo
            .Console()
            .ReadFrom.Configuration(
                config
            );
    }
);*/

// builder.Host.UseServiceProviderFactory(new AutofacServiceProviderFactory())

// builder.Services.AddApplicationServices(config);
// builder.Services.AddTransient<ISerializationService>();
// builder.Services.AddInfrastructureServices();
builder.Services.AddApplicationServices(config);
builder.Services.AddIdentityServices(config);
builder.Services.AddAuth(config);
builder.Services.AddOptions();
builder.Services.AddInfrastructureServices();
/*builder.Services.AddMediator(options =>
{
    options.ServiceLifetime = ServiceLifetime.Transient;
});*/
/*builder.Services.AddMediator(options =>
{
    options.ServiceLifetime = ServiceLifetime.Transient;
});*/
/*builder.Services.AddMediator(options =>
{
    // options.Namespace = "Auth.API.Handlers";
    options.ServiceLifetime = ServiceLifetime.Transient;
});*/
// builder.Services.AddAuthorization();
builder.Services.InitDbContext<AuthContext>(config, builder.Environment);

var assembly = typeof(Program).GetTypeInfo().Assembly;
builder.Services.AddAutoMapper(assembly);

const string corsPolicy = "CorsPolicy";
/*builder.Services.AddCors(options =>
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
});*/

builder.Services.InitCors(corsPolicy);


builder.Services.AddFastEndpoints(options => { options.SourceGeneratorDiscoveredTypes = DiscoveredTypes.All; });
// builder.Services.AddCookieAuth(TimeSpan.FromMinutes(10));
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders =
        ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
});

builder.Services.AddSwaggerDoc();

builder.Services.AddGrpc();
// builder.Use
/*builder.WebHost.ConfigureKestrel(options =>
{
    var grpcPort = config.GetValue("GRPC_PORT", 5001);
    var httpPort = config.GetValue("PORT", 80);
    options.Listen(IPAddress.Any, httpPort, listenOptions =>
    {
        listenOptions.Protocols = HttpProtocols.Http1AndHttp2;
    });

    options.Listen(IPAddress.Any, grpcPort, listenOptions =>
    {
        listenOptions.Protocols = HttpProtocols.Http2;
    });

});
var webHost = builder.WebHost.UseKestrel().ConfigureAppConfiguration(x => x.AddConfiguration(config)).Build();
webHost.Run();*/
// webHost.Services.
// webHost.B

var app = builder.Build();
/*
var builderConfig = new ConfigurationBuilder()
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddEnvironmentVariables();
    */

// builderConfig.Add

// var config = builderConfig.Build();

/*WebHost.CreateDefaultBuilder()
    .CaptureStartupErrors(false)
    .ConfigureKestrel(options =>
    {
        var grpcPort = config.GetValue("GRPC_PORT", 5001);
        var httpPort = config.GetValue("PORT", 80);
        options.Listen(IPAddress.Any, httpPort, listenOptions =>
        {
            listenOptions.Protocols = HttpProtocols.Http1AndHttp2;
        });

        options.Listen(IPAddress.Any, grpcPort, listenOptions =>
        {
            listenOptions.Protocols = HttpProtocols.Http2;
        });

    })
    .ConfigureAppConfiguration(x => x.AddConfiguration(config))*/

app.UseForwardedHeaders();

if (app.Environment.IsDevelopment()) app.UseDefaultExceptionHandler();


app.UseSerilogRequestLogging();
app.ConfigureSerilog();


app.UseCors(corsPolicy);
app.UseHttpsRedirection();
/*app.UseWhen(context => context.Request.Path.StartsWithSegments("/auth/login"),
    applicationBuilder => applicationBuilder.UseHttpsRedirection());*/


app.UseAuthentication();
// app.UseAuthorization();

var loginEndpoints = app.MapGroup("auth/login");

loginEndpoints.MapGet("/github", () => Results.Challenge(
    new AuthenticationProperties
    {
        RedirectUri = "http://localhost:4200/"
    }, new List<string> { "github" }));

loginEndpoints.MapGet("/google", () => Results.Challenge(
    new AuthenticationProperties
    {
        RedirectUri = "https://localhost:4200/"
        // RedirectUri = "https://localhost:7222/auth/login/google"
        // RedirectUri = "https://localhost:7222/"
    }, new List<string> { "google" }));

app.MapGrpcService<AppUsersGrpcService>();

/*services.AddGrpcClient<OrderingGrpc.OrderingGrpcClient>((services, options) =>
{
    var orderingApi = services.GetRequiredService<IOptions<UrlsConfig>>().Value.GrpcOrdering;
    options.Address = new Uri(orderingApi);
}).AddInterceptor<GrpcExceptionInterceptor>();*/

app.UseFastEndpoints(options =>
{
    // options.Errors.ResponseBuilder = (errors, _) => errors.ToResponse();
    options.Endpoints.RoutePrefix = "auth";
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

// IServiceCollection serviceCollection;
// services.

/*await new HostBuilder()
    .UseServiceProviderFactory(new AutofacServiceProviderFactory())
    .ConfigureServices(services => services.AddApplicationServices(config))
    /*.ConfigureContainer<ContainerBuilder>(builder =>
    {
        // builder.
        // builder.
        // builder.
        // registering services in the Autofac ContainerBuilder
    })#1#
    .UseSerilog()
    // .Use
    .UseConsoleLifetime()
    .Build()
    .RunAsync();*/


public partial class Program
{
    public static string Namespace = typeof(Program).Namespace;
    public static string AppName = Namespace.Substring(Namespace.LastIndexOf('.', Namespace.LastIndexOf('.') - 1) + 1);
}