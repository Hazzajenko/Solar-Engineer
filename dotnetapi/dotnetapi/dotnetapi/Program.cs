using Amazon.S3;
using dotnetapi.Data;
using dotnetapi.Extensions;
using dotnetapi.Models.Entities;
using dotnetapi.SignalR;
using dotnetapi.Validation;
using FastEndpoints;
using FastEndpoints.Swagger;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Serilog;
using Serilog.Events;
using Serilog.Sinks.SystemConsole.Themes;

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

builder.Host.UseSerilog((ctx, lc) => lc
    // .WriteTo.Console(theme: SystemConsoleTheme.Literate)
    .WriteTo.File("log.txt")
    .WriteTo.Console(
        theme: SystemConsoleTheme.Literate
        // outputTemplate: "{Timestamp:HH:mm} [{Level}] ({ThreadId}) {Message}{NewLine}{Exception}"
    )
    // .ReadFrom.Configuration(configuration));
    .ReadFrom.Configuration(ctx.Configuration));

Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Debug()
    .WriteTo.File("log.txt")
    .WriteTo.Console(LogEventLevel.Information)
    .CreateLogger();

Log.Information("test");
/*Log.Logger = new LoggerConfiguration()
    .CreateLogger();*/

var config = builder.Configuration;
config.AddEnvironmentVariables("dotnetapi_");


builder.Services.AddFastEndpoints();
builder.Services.AddSwaggerDoc();

/*builder.Services.AddDbContext<DataContext>
// builder.Services.AddDbContextFactory<DataContext>
    (options=> options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));*/

builder.Services.AddApplicationServices(config);
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
builder.Services.AddSignalR(options => { options.DisableImplicitFromServicesParameters = true; });
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
builder.Services.AddAWSService<IAmazonS3>();

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

app.UseFastEndpoints();
/*app.UseFastEndpoints( /*x =>
{
    x.ErrorResponseBuilder = (failures, _) =>
    {
        return new ValidationFailureResponse
        {
            Errors = failures.Select(y => y.ErrorMessage).ToList()
        };
    };
}#1#);*/

if (app.Environment.IsDevelopment())
{
    /*app.UseSwagger();
    app.UseSwaggerUI();*/
    app.UseOpenApi();
    app.UseSwaggerUi3(s => s.ConfigureDefaults());
}

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