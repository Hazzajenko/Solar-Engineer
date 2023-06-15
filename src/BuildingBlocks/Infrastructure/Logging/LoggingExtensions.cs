using System.Reflection;
using Amazon.CloudWatchLogs;
using Amazon.Runtime.CredentialManagement;
using Microsoft.ApplicationInsights.Extensibility;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Serilog;
using Serilog.Events;
using Serilog.Exceptions;
using Serilog.Settings.Configuration;
using Serilog.Sinks.AwsCloudWatch;

namespace Infrastructure.Logging;

public static partial class LoggingExtensions
{
    public static WebApplicationBuilder ConfigureSerilog(this WebApplicationBuilder builder)
    {
        var appName =
            builder.Configuration.GetValue<string>("App:Name")
            ?? Assembly.GetEntryAssembly()?.GetName().Name;
        if (appName is null)
            throw new ArgumentNullException(nameof(appName));

        var environment = builder.Environment;
        var config = builder.Configuration;

        _ = builder.Host.UseSerilog(
            (_, _, loggerConfig) =>
            {
                loggerConfig.Enrich
                    .FromLogContext()
                    .Enrich.WithProperty("Application", appName)
                    .Enrich.WithExceptionDetails()
                    .Enrich.WithMachineName()
                    .Enrich.WithProcessId()
                    .Enrich.WithThreadId()
                    .Enrich.FromLogContext()
                    .AddApplicationInsightsLogging(config, environment)
                    .WriteTo.Console();

                loggerConfig.WriteTo.Seq("http://localhost:5341");

                loggerConfig.MinimumLevel
                    .Override("Microsoft", LogEventLevel.Information)
                    .MinimumLevel.Override(
                        "Microsoft.AspNetCore.SignalR",
                        LogEventLevel.Information
                    )
                    .MinimumLevel.Override(
                        "Microsoft.AspNetCore.Http.Connections",
                        LogEventLevel.Information
                    )
                    .MinimumLevel.Override("Microsoft.EntityFrameworkCore", LogEventLevel.Error);
            }
        );

        return builder;
    }

    private static LoggerConfiguration AddApplicationInsightsLogging(
        this LoggerConfiguration loggerConfiguration,
        IConfiguration config,
        IWebHostEnvironment environment
    )
    {
        var applicationInsightsConnectionString = environment.IsDevelopment()
            ? config["Azure:ApplicationInsights:ConnectionString"]
            : GetEnvironmentVariable("AZURE_APPLICATION_INSIGHTS_CONNECTION_STRING");
        var instrumentationKey = environment.IsDevelopment()
            ? config["Azure:ApplicationInsights:InstrumentationKey"]
            : GetEnvironmentVariable("AZURE_APPLICATION_INSIGHTS_INSTRUMENTATION_KEY");
        TelemetryConfiguration telemetryConfiguration = new TelemetryConfiguration
        {
            ConnectionString = applicationInsightsConnectionString,
            InstrumentationKey = instrumentationKey,
        };
        loggerConfiguration.WriteTo.ApplicationInsights(
            telemetryConfiguration,
            TelemetryConverter.Traces
        );

        return loggerConfiguration;
    }
}
