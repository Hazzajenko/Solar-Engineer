using FastEndpoints;
using FastEndpoints.Swagger;
using Infrastructure.Authentication;
using Infrastructure.Data;
using Infrastructure.Logging;
using Infrastructure.SignalR;
using Infrastructure.Web;
using Microsoft.AspNetCore.HttpOverrides;
using Projects.API.Data;
using Projects.API.Extensions;

var builder = WebApplication.CreateBuilder(
    new WebApplicationOptions { Args = args, ContentRootPath = Directory.GetCurrentDirectory() }
);

// builder.RegisterSerilog();
builder.ConfigureSerilog();

var config = builder.Configuration;
config.AddEnvironmentVariables("solarengineer_");

builder.Services.AddApplicationServices(config);
builder.Services.ConfigureJwtAuthentication(config);
builder.Services.AddAuthorization();
builder.Services.InitDbContext<ProjectsContext>(config, builder.Environment);

builder.Services.ConfigureSignalRWithRedis(builder.Environment);

/*builder.Services.AddSignalR(options =>
{
    options.DisableImplicitFromServicesParameters = true;
    // options.
    if (builder.Environment.IsDevelopment()) options.EnableDetailedErrors = true;
}).AddStackExchangeRedis("localhost", options => {
    options.Configuration.ChannelPrefix = "SolarEngineerApp";
});*/

builder.Services.InitCors("corsPolicy");

builder.Services.AddFastEndpoints( /*options => { options.SourceGeneratorDiscoveredTypes = DiscoveredTypes.All; }*/
);

builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
});

builder.Services.AddSwaggerDoc();

var app = builder.Build();

app.ConfigurePipeline();

app.Use(
    async (context, next) =>
    {
        // Connection: RemoteIp
        app.Logger.LogInformation(
            "Request RemoteIp: {RemoteIpAddress}",
            context.Connection.RemoteIpAddress
        );

        await next(context);
    }
);

AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
app.Run();