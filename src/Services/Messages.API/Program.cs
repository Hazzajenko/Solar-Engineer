using FastEndpoints;
using FastEndpoints.Swagger;
using Infrastructure.Authentication;
using Infrastructure.Data;
using Infrastructure.Logging;
using Infrastructure.SignalR;
using Infrastructure.Web;
using Messages.API.Data;
using Messages.API.Entities;
using Messages.API.Extensions;
using Messages.API.Extensions.Application;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(
    new WebApplicationOptions { Args = args, ContentRootPath = Directory.GetCurrentDirectory() }
);

builder.ConfigureSerilog();


var config = builder.Configuration;
config.AddEnvironmentVariables("solarengineer_");

/*
builder.Host.UseSerilog(
    (_, loggerConfig) =>
    {
        loggerConfig.WriteTo
            .Console()
            .ReadFrom.Configuration(
                config
            );
    }
);*/

// builder.Services.AddAuth(config);
// builder.Services.AddApplicationServices(config);
builder.Services.AddApplicationServices(config);
builder.Services.ConfigureJwtAuthentication(config);
builder.Services.AddAuthorization();

builder.Services.ConfigureSignalRWithRedis(builder.Environment);
/*builder.Services.AddSignalR(options =>
{
    options.DisableImplicitFromServicesParameters = true;
    if (builder.Environment.IsDevelopment()) options.EnableDetailedErrors = true;
});*/

/*builder.Services.AddAuthorization(opt =>
{
    opt.AddPolicy("RequireAdminRole", policy => policy.RequireRole("Admin"));
    opt.AddPolicy("BeAuthenticated", policy => policy.RequireRole("User"));
});*/


builder.Services.InitDbContext<MessagesContext>(config, builder.Environment);


const string corsPolicy = "CorsPolicy";
builder.Services.InitCors(corsPolicy);
builder.Services.AddFastEndpoints();
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders =
        ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
});

builder.Services.AddSwaggerDoc();

var app = builder.Build();

/*app.UseForwardedHeaders();

app.UseSerilogRequestLogging();
app.UseCors(corsPolicy);
app.UseAuthentication();
app.UseAuthorization();
// app.UseCookiePolicy();

app.MapHub<MessagesHub>("hubs/messages");*/
app.ConfigurePipeline();

AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;
try
{
    var context = services.GetRequiredService<MessagesContext>();
    await context.Database.MigrateAsync();
    var genericDataSeeder = new DbContextSeedUsers<MessagesContext, User>();
    await genericDataSeeder.SeedUsersAsync(context);
}
catch (Exception ex)
{
    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "An error occurred during migration");
}

await app.RunAsync();