using System.Net.Mime;
using System.Text.Json.Serialization;
using Amazon.CloudWatchLogs;
using Amazon.S3;
using dotnetapi;
using dotnetapi.Data;
using dotnetapi.Extensions;
using dotnetapi.Helpers;
using dotnetapi.Hubs;
using dotnetapi.Models.Entities;
using dotnetapi.Validation;
using FastEndpoints;
using FastEndpoints.Swagger;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Serilog;
using Serilog.Sinks.AwsCloudWatch;

var builder = WebApplication.CreateBuilder(new WebApplicationOptions
{
    Args = args,
    ContentRootPath = Directory.GetCurrentDirectory()
});

/*{
    configure.AddFilter("Microsoft.AspNetCore.SignalR", LogLevel.Debug);
    configure.AddFilter("Microsoft.AspNetCore.Http.Connections", LogLevel.Debug);
}*/

/*builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.KnownProxies.Add(IPAddress.Parse("10.0.0.100"));
    options.ForwardedHeaders =
        ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
    // options.
});*/
// var builder = WebApplication.CreateBuilder(args);

/*
var configuration = new ConfigurationBuilder()
    .AddJsonFile("appsettings.json")
    .Build();
    */


/*Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Debug()
    // .WriteTo.File("log.txt")
    .WriteTo.Console(LogEventLevel.Information)
    .CreateLogger();*/

// Log.Information("test");
/*Log.Logger = new LoggerConfiguration()
    .CreateLogger();*/

var config = builder.Configuration;
config.AddEnvironmentVariables("dotnetapi_");

builder.Host.UseSerilog((_, loggerConfig) =>
{
    loggerConfig.WriteTo.Console()
        .WriteTo.AmazonCloudWatch(
            // logGroup: $"{builder.Environment.EnvironmentName}/{builder.Environment.ApplicationName}",
            "/dotnet/logging-demo/serilog",
            createLogGroup: true,
            logStreamPrefix: DateTime.UtcNow.ToString("yyyyMMddHHmmssfff"),
            cloudWatchClient: new AmazonCloudWatchLogsClient()
        )
        .ReadFrom.Configuration(config) /*.CreateLogger()*/;
});

/*builder.Services.AddMassTransit(x =>
{
    var entryAssembly = Assembly.GetEntryAssembly();

    x.AddConsumers(entryAssembly);
    x.AddSagaStateMachines(entryAssembly);
    x.AddSagas(entryAssembly);
    x.AddActivities(entryAssembly);

    x.AddConsumer<SubmitOrderConsumer>(typeof(SubmitOrderConsumerDefinition))
        .Endpoint(e =>
        {
            // override the default endpoint name
            e.Name = "order-service-extreme";

            // specify the endpoint as temporary (may be non-durable, auto-delete, etc.)
            e.Temporary = false;

            // specify an optional concurrent message limit for the consumer
            e.ConcurrentMessageLimit = 8;

            // only use if needed, a sensible default is provided, and a reasonable
            // value is automatically calculated based upon ConcurrentMessageLimit if
            // the transport supports it.
            e.PrefetchCount = 16;

            // set if each service instance should have its own endpoint for the consumer
            // so that messages fan out to each instance.
            e.InstanceId = "something-unique";
        });

    x.UsingRabbitMq((context, cfg) =>
    {
        cfg.Host("localhost", "/", h =>
        {
            h.Username("guest");
            h.Password("guest");
        });

        cfg.ReceiveEndpoint("account-service", e =>
        {
            e.Lazy = true;
            e.PrefetchCount = 20;
            e.Consumer<AccountConsumer>();
        });

        cfg.ConfigureEndpoints(context);
    });
});

builder.Services.AddHostedService<Worker>();*/

builder.Services.AddFastEndpoints();
builder.Services.AddSwaggerDoc();

/*
var logClient = new AmazonCloudWatchLogsClient();
var logGroupName = "/aws/weather-forecast-app";
var logStreamName = DateTime.UtcNow.ToString("yyyyMMddHHmmssfff");
var existing = await logClient
    .DescribeLogGroupsAsync(new DescribeLogGroupsRequest { LogGroupNamePrefix = logGroupName });
var logGroupExists = existing.LogGroups.Any(l => l.LogGroupName == logGroupName);
if (!logGroupExists)
    await logClient.CreateLogGroupAsync(new CreateLogGroupRequest(logGroupName));
await logClient.CreateLogStreamAsync(new CreateLogStreamRequest(logGroupName, logStreamName));
await logClient.PutLogEventsAsync(new PutLogEventsRequest
{
    LogGroupName = logGroupName,
    LogStreamName = logStreamName,
    LogEvents = new List<InputLogEvent>
    {
        new()
        {
            Message = "Get Weather Forecast called for city",
            Timestamp = DateTime.UtcNow
        }
    }
});*/

/*builder.Host.UseSerilog((ctx, lc) => lc
    // .WriteTo.Console(theme: SystemConsoleTheme.Literate)
    // .WriteTo.File("log.txt")
    .WriteTo.Console(
        theme: SystemConsoleTheme.Literate
        // outputTemplate: "{Timestamp:HH:mm} [{Level}] ({ThreadId}) {Message}{NewLine}{Exception}"
    )
    // .ReadFrom.Configuration(configuration));
    .ReadFrom.Configuration(ctx.Configuration));*/

/*builder.Services.AddDbContext<DataContext>
// builder.Services.AddDbContextFactory<DataContext>
    (options=> options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));*/

builder.Services.AddApplicationServices(config);
builder.Services.AddHealthChecks();
// builder.Services.AddDatabaseDeveloperPageExceptionFilter();
/*builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });*/
/*builder.Services.AddControllers(options => { options.Conventions.Add(new GroupingByNamespaceConvention()); })
    .AddJsonOptions(options => { options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase; });*/
builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "CorsPolicy",
        policy => policy
            // .WithOrigins(builder.Configuration.GetValue<string>("AllowedOrigins")!)
            .WithOrigins("http://localhost:8100", "http://localhost:4200", "http://127.0.0.1:5173")
            // .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials());
});
// builder.Services.AddSignalR();
builder.Services.AddSignalR(options =>
{
    options.DisableImplicitFromServicesParameters = true;
    options.EnableDetailedErrors = true;
    // options.
});
// builder.Services.AddSignalR().AddMessagePackProtocol();
// builder.Services.AddWebSockets();
builder.Services.AddSwaggerServices(config);


builder.Services.AddIdentityServices(config);
/*.AddFluentValidation(x =>
{
    x.RegisterValidatorsFromAssemblyContaining<Program>();
    x.DisableDataAnnotationsValidation = true;
});;*/

// builder.Services.AddEndpointsApiExplorer();
// builder.Services.AddSwaggerGen();
builder.Services.AddDefaultAWSOptions(builder.Configuration.GetAWSOptions());
// builder.Services.AddAWSService<IAmazonS3>();
builder.Services.AddSingleton<IAmazonS3, AmazonS3Client>();


/*builder.Services.AddHsts(options =>
{
    options.Preload = true;
    options.IncludeSubDomains = true;
    options.MaxAge = TimeSpan.FromDays(60);
    // options.ExcludedHosts.Add("example.com");
    // options.ExcludedHosts.Add("www.example.com");
});

builder.Services.AddHttpsRedirection(options =>
{
    options.RedirectStatusCode = (int)HttpStatusCode.TemporaryRedirect;
    options.HttpsPort = 5001;
});*/

var app = builder.Build();
MethodTimeLogger.Logger = app.Logger;

app.UseSerilogRequestLogging();

// Configure the HTTP request pipeline.
// var apiVersionDescriptionProvider = app.Services.GetRequiredService<IApiVersionDescriptionProvider>();
app.UseForwardedHeaders();


app.UseRouting();

// app.UseHsts();
// app.UseStaticFiles();

// app.UseHttpsRedirection();


app.UseCors("CorsPolicy");

app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
});

app.UseAuthentication();
app.UseAuthorization();

app.UseMiddleware<ValidationExceptionMiddleware>();

app.UseFastEndpoints(options =>
{
    // options.Errors.ResponseBuilder = (errors, _) => errors.ToResponse();
    options.Serializer.Options.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    options.Endpoints.Configurator = ep => { ep.PreProcessors(Order.Before, new UpdateLastActiveProcessor()); };
    // x.Serializer.Options.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
});
// app.MapHealthChecks("api_health_check");
//     /*.AddJsonOptions(options =>
// {
//     options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
//     options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
// });#1#
// /*app.*//*UseFastEndpoints*/( /*x =>
// {
//     x.ErrorResponseBuilder = (failures, _) =>
//     {
//         return new ValidationFailureResponse
//         {
//             Errors = failures.Select(y => y.ErrorMessage).ToList()
//         };
//     };
// }#1#);*/

if (app.Environment.IsDevelopment())
{
    /*app.UseSwagger();
    app.UseSwaggerUI();*/
    app.UseOpenApi();
    app.UseSwaggerUi3(s => s.ConfigureDefaults());
}

app.UseHealthChecks("/health",
    new HealthCheckOptions
    {
        ResponseWriter = async (context, report) =>
        {
            var result = new
            {
                status = report.Status.ToString(),
                errors = report.Entries.Select(e => new
                {
                    key = e.Key,
                    value = Enum.GetName(typeof(HealthStatus), e.Value.Status)
                })
            }.ToJson();
            context.Response.ContentType = MediaTypeNames.Application.Json;
            await context.Response.WriteAsync(result);
        }
    });

// app.UseDefaultFiles();
// app.UseStaticFiles();

// app.MapControllers();

// app.UseWebSockets();
app.UseWebSockets(new WebSocketOptions
{
    KeepAliveInterval = TimeSpan.FromSeconds(120)
});
// app.MapHub<UserHub>("/user");
app.MapHub<ConnectionsHub>("hubs/connections");
app.MapHub<NotificationsHub>("hubs/notifications");
app.MapHub<MessagesHub>("hubs/messages");
// app.MapHub<ViewsHub>("hubs/views");


/*app.UseEndpoints(
    configure =>
    {
        configure.MapHub<ConnectionsHub>("/hubs/connections");
        configure.MapControllers();
        
    });*/

AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;
try
{
    var context = services.GetRequiredService<DataContext>();
    var userManager = services.GetRequiredService<UserManager<AppUser>>();
    var roleManager = services.GetRequiredService<RoleManager<AppRole>>();
    await context.Database.MigrateAsync();
    await Seed.SeedUsers(userManager, roleManager);
}
catch (Exception ex)
{
    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "An error occurred during migration");
}

// app.Run();
await app.RunAsync();