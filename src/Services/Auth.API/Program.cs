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
using Infrastructure.Data;
using Infrastructure.Logging.Serilog;
using Infrastructure.Web;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Serilog;
using StackExchange.Redis;

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
var entryAssembly = Assembly.GetEntryAssembly() ?? throw new ArgumentNullException(nameof(Assembly));
builder.Services.AddApplicationServices(config, entryAssembly);
builder.Services.AddIdentityServices(config);
builder.Services.AddAuthServices(config);
builder.Services.AddOptions();
builder.Services.AddInfrastructureServices();
/*var option = new ConfigurationOptions
{
    AbortOnConnectFail = false,
    EndPoints = { "localhost:6379" }
};*/
var redisConn = ConnectionMultiplexer.Connect("localhost");
builder.Services.AddDataProtection()
    .PersistKeysToStackExchangeRedis(redisConn)
    .SetApplicationName("solarEngineer");
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
app.UseAuthorization();
app.UseCookiePolicy(
    new CookiePolicyOptions
    {
        Secure = CookieSecurePolicy.Always,
        MinimumSameSitePolicy = SameSiteMode.Strict     
    });

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

/*
var clientOptions = new ServiceBusClientOptions
{
    TransportType = ServiceBusTransportType.AmqpWebSockets
};

ServiceBusClient client;

ServiceBusSender sender;
client = new ServiceBusClient(
    "solarengineer.servicebus.windows.net",
    new DefaultAzureCredential(),
    clientOptions);
sender = client.CreateSender("solarQueue");

using var messageBatch = await sender.CreateMessageBatchAsync();
const int numOfMessages = 3;
for (var i = 1; i <= numOfMessages; i++)
    // try adding a message to the batch
    if (!messageBatch.TryAddMessage(new ServiceBusMessage($"Message {i}")))
        // if it is too large for the batch
        throw new Exception($"The message {i} is too large to fit in the batch.");

try
{
    // Use the producer client to send the batch of messages to the Service Bus queue
    await sender.SendMessagesAsync(messageBatch);
    Console.WriteLine($"A batch of {numOfMessages} messages has been published to the queue.");
}
finally
{
    // Calling DisposeAsync on client types is required to ensure that network
    // resources and other unmanaged objects are properly cleaned up.
    await sender.DisposeAsync();
    await client.DisposeAsync();
}

var options = new SecretClientOptions
{
    Retry =
    {
        Delay = TimeSpan.FromSeconds(2),
        MaxDelay = TimeSpan.FromSeconds(16),
        MaxRetries = 5,
        Mode = RetryMode.Exponential
    }
};

var uri = config["Azure:Vault:Uri"]!;
var secretClient =
    new SecretClient(new Uri(uri), new DefaultAzureCredential(), options);
// new SecretClient(new Uri("https://solarengineer.vault.azure.net/"), new DefaultAzureCredential(), options);

KeyVaultSecret secret = secretClient.GetSecret("secret");

var secretValue = secret.Value;
Console.WriteLine(secretValue);

try
{
    /*var bus = services.GetRequiredService<IBus>();
    var endpoint = await bus.GetSendEndpoint(new Uri(""));
    var obj = new
    {
        hey = "hello"
    };
    await endpoint.Send(obj);
    Console.WriteLine("sent");#1#
    // var userManager = services.GetRequiredService<UserManager<AppUser>>();
    // var roleManager = services.GetRequiredService<RoleManager<AppRole>>();
    // await context.Database.MigrateAsync();
    // await AuthContextSeed.SeedAll(userManager, roleManager);
}
catch (Exception ex)
{
    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "An error occurred during migration");
}
*/

/*
ServiceBusProcessor processor;
processor = client.CreateProcessor("solarQueue", new ServiceBusProcessorOptions());

try
{
    // add handler to process messages
    processor.ProcessMessageAsync += MessageHandler;

    // add handler to process any errors
    processor.ProcessErrorAsync += ErrorHandler;

    // start processing 
    await processor.StartProcessingAsync();

    Console.WriteLine("Wait for a minute and then press any key to end the processing");
    Console.ReadKey();

    // stop processing 
    Console.WriteLine("\nStopping the receiver...");
    await processor.StopProcessingAsync();
    Console.WriteLine("Stopped receiving messages");
}
finally
{
    // Calling DisposeAsync on client types is required to ensure that network
    // resources and other unmanaged objects are properly cleaned up.
    await processor.DisposeAsync();
    await client.DisposeAsync();
}*/

await app.RunAsync();

// handle received messages
/*async Task MessageHandler(ProcessMessageEventArgs args)
{
    var body = args.Message.Body.ToString();
    Console.WriteLine($"Received: {body}");

    // complete the message. message is deleted from the queue. 
    await args.CompleteMessageAsync(args.Message);
}

// handle any errors when receiving messages
Task ErrorHandler(ProcessErrorEventArgs args)
{
    Console.WriteLine(args.Exception.ToString());
    return Task.CompletedTask;
}*/

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