using System.Text.Json;
using System.Text.Json.Serialization;
using Auth.API;
using FastEndpoints;
using FastEndpoints.Swagger;
using Infrastructure.Authentication;
using Infrastructure.Config;
using Infrastructure.Data;
using Infrastructure.Grpc;
using Infrastructure.Web;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.Extensions.Options;
using Serilog;
using Users.API.Data;
using Users.API.Extensions;

// var builder = WebApplication.CreateBuilder(args);
var builder = WebApplication.CreateBuilder(
    new WebApplicationOptions { Args = args, ContentRootPath = Directory.GetCurrentDirectory() }
);
// var appName = builder.RegisterSerilog();

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

builder.Services.AddMediator(options => { options.ServiceLifetime = ServiceLifetime.Transient; });
builder.Services.AddAuth(config);
builder.Services.AddAppServices(config);
// builder.Services.AddAuthorization();
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
builder.Services.InitDbContext<UsersContext>(config, builder.Environment);
builder.Services.Configure<UrlsConfig>(config.GetSection("Urls"));

builder.Services.AddGrpcClient<AuthGrpc.AuthGrpcClient>((services, options) =>
{
    var grpcAuth = services.GetRequiredService<IOptions<UrlsConfig>>().Value.GrpcAuth;
    if (grpcAuth is null) grpcAuth = config["Urls:grpcAuth"];
    options.Address = new Uri(grpcAuth);
}).AddInterceptor<GrpcExceptionInterceptor>();

const string corsPolicy = "CorsPolicy";
builder.Services.InitCors(corsPolicy);

builder.Services.AddFastEndpoints(options => { options.SourceGeneratorDiscoveredTypes = DiscoveredTypes.All; });

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

app.UseFastEndpoints(options =>
{
    options.Endpoints.RoutePrefix = "users";
    options.Errors.StatusCode = StatusCodes.Status422UnprocessableEntity;
    options.Serializer.Options.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    options.Serializer.Options.ReferenceHandler = ReferenceHandler.IgnoreCycles;
});


if (app.Environment.IsDevelopment())
{
    app.UseOpenApi();
    app.UseSwaggerUi3(x => x.ConfigureDefaults());
}

AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

app.Run();


public partial class Program
{
    public static string Namespace = typeof(Program).Namespace;
    public static string AppName = Namespace.Substring(Namespace.LastIndexOf('.', Namespace.LastIndexOf('.') - 1) + 1);
}
