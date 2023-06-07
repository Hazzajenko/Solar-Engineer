using Infrastructure.Authentication;
using Infrastructure.Logging;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.HttpOverrides;
using YarpGateway.Extensions.Application;

var builder = WebApplication.CreateBuilder(
    new WebApplicationOptions { Args = args, ContentRootPath = Directory.GetCurrentDirectory() }
);
builder.ConfigureSerilog();

var config = builder.Configuration;
config.AddEnvironmentVariables("solarengineer_");
var environment = builder.Environment;

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
var jwtKey = await environment.GetSymmetricSecurityKey(config);

builder.Services.ConfigureJwtAuthentication(config, jwtKey);
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("RequireAuthenticatedUser", policy => policy.RequireAuthenticatedUser());
});
// builder.Services.ConfigureSignalRWithRedis(builder.Environment);
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
});
// var clientCert = new X509Certificate2("path");
builder.Services.AddReverseProxy() /*.ConfigureHttpClient(options => options.OldClient = true)*/
    // .AddSingleton<IProxyConfigProvider>(new CustomProxyConfigProvider())
    .LoadFromConfig(config.GetSection("ReverseProxy"))
    /*.ConfigureHttpClient((context, handler) =>
    {
        handler.SslOptions.ClientCertificates?.Add(clientCert);
    })*/;

// builder.Services.InitServiceCollection(config);

var app = builder.Build();

app.ConfigurePipeline();

app.MapReverseProxy(proxyConfig =>
{
    // proxyConfig.;
    // config.UseSessionAffinity(); // Has no affect on delegation destinations
    // config.UseLoadBalancing();
    // config.UsePassiveHealthChecks();
    // config.UseHttpSysDelegation();
    proxyConfig.Use(
        async (context, next) =>
        {
            var token = await context.GetTokenAsync("access_token");
            context.Request.Headers["Authorization"] = $"Bearer {token}";

            await next().ConfigureAwait(false);
        }
    );
});

// app.MapGet("/", () => "Hello World!");

app.Run();