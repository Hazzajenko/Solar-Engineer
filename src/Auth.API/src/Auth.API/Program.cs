using System.Text.Json;
using System.Text.Json.Serialization;

using Auth.API.Data;
using Auth.API.Extensions;

using DotNetCore.IoC;

using FastEndpoints.Swagger;

using Serilog;


// var builder = WebApplication.CreateBuilder(args);
var builder = WebApplication.CreateBuilder(
    new WebApplicationOptions { Args = args, ContentRootPath = Directory.GetCurrentDirectory() }
);

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


builder.Services.AddApplicationServices(config);
builder.Services.AddDbContext<AuthContext>(config, builder.Environment);
builder.Services.AddScoped<IDataSeeder, AuthDataSeeder>();
const string corsPolicy = "CorsPolicy";
builder.Services.AddCors(options =>
{
    options.AddPolicy(
        corsPolicy,
        policy =>
            policy
                .WithOrigins(
                    "http://localhost:8100",
                    "http://localhost:4200",
                    "http://127.0.0.1:5173"
                )
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials()
    );
});


/*builder.WebHost.ConfigureKestrel(options =>
{
    options.AddServerHeader = false;
    options.AllowSynchronousIO = false;
});*/


builder.Host.UseConsoleLifetime(options => options.SuppressStatusMessages = true);


builder.Services.AddAuthentication();
builder.Services.AddAuthorization();

builder.Services.AddClassesMatchingInterfaces(nameof(Auth.API));

builder.Services.AddFastEndpoints(options => { options.SourceGeneratorDiscoveredTypes = DiscoveredTypes.All; });

builder.Services.AddSwaggerDoc();

// builder.Environment.

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseDefaultExceptionHandler();
}

app.ConfigureMigrations<AuthContext>(builder.Environment);

app.UseSerilogRequestLogging();

app.UseCors(corsPolicy);

app.UseAuthentication();
app.UseAuthorization();

app.UseFastEndpoints(options =>
{
    // options.Errors.ResponseBuilder = (errors, _) => errors.ToResponse();
    options.Errors.StatusCode = StatusCodes.Status422UnprocessableEntity;
    options.Serializer.Options.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    options.Serializer.Options.ReferenceHandler = ReferenceHandler.IgnoreCycles;
});

if (app.Environment.IsDevelopment())
{
    app.UseOpenApi();
    app.UseSwaggerUi3(x => x.ConfigureDefaults());
}

await app.RunAsync();


