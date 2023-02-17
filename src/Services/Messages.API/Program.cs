// var builder = WebApplication.CreateBuilder(args);

using FastEndpoints.Swagger;
using Infrastructure.Authentication;
using Infrastructure.Data;
using Infrastructure.Web;
using Messages.API.Data;
using Messages.API.Extensions;
using Messages.API.Hubs;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using Serilog;

var builder = WebApplication.CreateBuilder(
    new WebApplicationOptions { Args = args, ContentRootPath = Directory.GetCurrentDirectory() }
);
// Add services to the container.

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

builder.Services.AddAuth(config);
builder.Services.AddAppServices(config);
builder.Services.AddSignalR(options =>
{
    options.DisableImplicitFromServicesParameters = true;
    if (builder.Environment.IsDevelopment()) options.EnableDetailedErrors = true;

    // options.
});

builder.Services.AddAuthorization(opt =>
{
    opt.AddPolicy("RequireAdminRole", policy => policy.RequireRole("Admin"));
    opt.AddPolicy("BeAuthenticated", policy => policy.RequireRole("User"));
    /*opt.AddPolicy(
        "read:messages",
        policy => policy.Requirements.Add(new HasScopeRequirement("read:messages", domain!))
    );
    opt.AddPolicy(
        "read:current_user",
        policy =>
            policy.Requirements.Add(new HasScopeRequirement("read:current_user", domain!))
    );*/
    // read:current_user
});
// builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
// builder.Services.AddEndpointsApiExplorer();
// builder.Services.AddSwaggerGen();

builder.Services.InitDbContext<MessagesContext>(config, builder.Environment);

const string corsPolicy = "CorsPolicy";
builder.Services.InitCors(corsPolicy);

// builder.Services.AddFastEndpoints(options => { options.SourceGeneratorDiscoveredTypes = DiscoveredTypes.All; });

builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders =
        ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
});

builder.Services.AddSwaggerDoc();

var app = builder.Build();

app.UseForwardedHeaders();

app.UseSerilogRequestLogging();
app.UseCors(corsPolicy);
app.UseAuthentication();
app.UseAuthorization();
app.UseCookiePolicy();


/*
app.UseFastEndpoints(options =>
{
    // options.Errors.ResponseBuilder = (errors, _) => errors.ToResponse();
    options.Endpoints.RoutePrefix = "users";
    options.Errors.StatusCode = StatusCodes.Status422UnprocessableEntity;
    options.Serializer.Options.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    options.Serializer.Options.ReferenceHandler = ReferenceHandler.IgnoreCycles;
});
*/

app.MapHub<MessagesHub>("hubs/messages");

/*
if (app.Environment.IsDevelopment())
{
    app.UseOpenApi();
    app.UseSwaggerUi3(x => x.ConfigureDefaults());
}*/

// app.UseHttpsRedirection();

// app.UseAuthorization();

// app.MapControllers();

// app.Run();
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;
try
{
    var context = services.GetRequiredService<MessagesContext>();
    // var userManager = services.GetRequiredService<UserManager<AppUser>>();
    // var roleManager = services.GetRequiredService<RoleManager<AppRole>>();
    await context.Database.MigrateAsync();
    await context.SeedAsync();
    // await Seed.SeedUsers(userManager, roleManager);
}
catch (Exception ex)
{
    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "An error occurred during migration");
}

await app.RunAsync();