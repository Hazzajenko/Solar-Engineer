using FastEndpoints;
using Infrastructure.Authentication;
using Infrastructure.Data;
using Infrastructure.Logging;
using Infrastructure.OpenTelemetry;
using Infrastructure.Swagger;
using Infrastructure.Web;
using Microsoft.AspNetCore.HttpOverrides;
using Projects.Application.Data;
using Projects.Application.Extensions;

var builder = WebApplication.CreateBuilder(
    new WebApplicationOptions { Args = args, ContentRootPath = Directory.GetCurrentDirectory() }
);

// builder.Host.ApplyOaktonExtensions();

// var webHost = WebHost.CreateDefaultBuilder(args)
/*.UseStartup<Startup>()*/
// ;

// builder.RegisterSerilog();
builder.ConfigureSerilog();

var config = builder.Configuration;
config.AddEnvironmentVariables("solarengineer_");

// builder.Services.InitMarten(config);

// var listenerQueues = new[] { "appuser-events", "project-event-responses" };
/*var listenerQueues = new ListenerQueue[]
{
    new("appuser-events"),
    new("project-event-responses", true)
};
var senderQueues = new SenderQueue[] { new("project-events", typeof(ProjectEvent)) };*/

/*builder.Host.InitWolverine(
    config,
    QueueConfig.ListenerQueues,
    QueueConfig.SenderQueues,
    typeof(IProjectsApplicationAssemblyMarker).Assembly
);*/

// builder.Host.InitProjectsWolverine(config);
builder.Services.InitOpenTelemetry(config);

/*builder.Services.AddMediator(options => { options.ServiceLifetime = ServiceLifetime.Transient; });*/
builder.Services.AddApplicationServices(config);

/*builder.Services.AddMassTransit(x =>
{
    x.SetKebabCaseEndpointNameFormatter();
    x.SetInMemorySagaRepositoryProvider();

    var assembly = typeof(IProjectsApplicationAssemblyMarker).Assembly;

    x.AddConsumers(assembly);
    x.AddSagaStateMachines(assembly);
    x.AddSagas(assembly);
    x.AddActivities(assembly);

    x.UsingRabbitMq((context, cfg) =>
    {
        cfg.Host("localhost", "/", h =>
        {
            h.Username("guest");
            h.Password("guest");
        });
        cfg.ConfigureEndpoints(context);
    });
});*/


// Register(typeof(IUserIdProvider), () => new HubsUserIdProvider());
// builder.WebHost.
// GlobalHost.DependencyResolver.Register(typeof(IUserIdProvider), () => new MyIdProvider());
// GlobalHost;
// GlobalHost.DependencyResolver.Register(typeof(IUserIdProvider), () => new HubsUserIdProvider());
builder.Services.ConfigureJwtAuthentication(config);
builder.Services.AddAuthorization();

// builder.Services.InitDbContext<ProjectsContext>(config, builder.Environment);
builder.Services.InitDbContext<ProjectsContext>(
    config,
    builder.Environment,
    "Projects.Application"
);

builder.Services.ConfigureSignalRWithRedis(builder.Environment);

/*builder.Services
    .AddSignalR(options =>
    {
        options.DisableImplicitFromServicesParameters = true;
        if (builder.Environment.IsDevelopment())
            options.EnableDetailedErrors = true;
        options.AddFilter<HubLoggerFilter>();
    })
    .AddStackExchangeRedis(
        "localhost",
        options => { options.Configuration.ChannelPrefix = "SolarEngineerApp"; }
    );*/

// BogusGenerators.InitBogusData();

// options.AddFilter<CustomFilter>();
/*builder.Services.AddSignalR(options =>
{
    options.DisableImplicitFromServicesParameters = true;
    // options.
    if (builder.Environment.IsDevelopment()) options.EnableDetailedErrors = true;
}).AddStackExchangeRedis("localhost", options => {
    options.Configuration.ChannelPrefix = "SolarEngineerApp";
});*/

builder.Services.InitCors("corsPolicy");

// builder.Services.AddFastEndpoints(options => { options.SourceGeneratorDiscoveredTypes = DiscoveredTypes.All; });
builder.Services.AddFastEndpoints();
// builder.Services.AddFastEndpoints(options => { options.SourceGeneratorDiscoveredTypes = DiscoveredTypes.All; });

builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
});

builder.Services.InitSwaggerDocs(config);

// builder.Services.AddSwaggerDoc();

var app = builder.Build();

app.ConfigurePipeline();

/*app.MapGet("/stream", (IQuerySession Session) =>
{
    var stream = Session.Events.FetchStream(Guid.NewGuid());
    return stream;
});*/

/*
app.MapGet(
    "/rebuild",
    async (IDocumentStore store) =>
    {
        var daemon = await store.BuildProjectionDaemonAsync();
        await daemon.RebuildProjection<UserSummary>(CancellationToken.None);
        return "rebuilt!";
    }
);

app.MapGet(
    "/append/{guid}",
    async (Guid guid, IDocumentSession session) =>
    {
        session.Events.Append(guid, new UserCreated(Guid.NewGuid(), ServiceName.Projects));

        await session.SaveChangesAsync();

        return "created!";
    }
);

app.MapGet(
    "/stream/{guid}",
    (Guid guid, IQuerySession session) => { return session.LoadAsync<UserSummary>(guid); }
);*/

/*app.Use(
    async (context, next) =>
    {
        // Connection: RemoteIp
        app.Logger.LogInformation(
            "Request RemoteIp: {RemoteIpAddress}",
            context.Connection.RemoteIpAddress
        );

        await next(context);
    }
);*/

AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

// BogusGenerators.InitBogusData();
app.Run();

/*
public class UserSummary
{
    public Guid Id { get; set; }
    
    public List<string> Logs { get; set; } = new();
}

public class UserSummaryProjector : MultiStreamAggregation<UserSummary, Guid>
{
    public UserSummaryProjector()
    {
        Identity<IAppUserEventMessage>(x => x.UserId);
    }

    public void Apply(UserSummary snapshot, UserCreated e)
    {
        snapshot.Logs.Add($"{e.UserId} created");
    }

    /*public void Apply(UserSummary snapshot, User e)
    {
        snapshot.Comments.Add(e.Content);
    }#1#
}
*/