using System.Reflection;
using Amazon.CloudWatchLogs;
using Amazon.Runtime.CredentialManagement;
using Azure;
using Azure.Storage.Blobs;
using Microsoft.ApplicationInsights.Extensibility;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Azure;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using OpenTelemetry.Exporter;
using Serilog;
using Serilog.Events;
using Serilog.Exceptions;
using Serilog.Exceptions.Core;
using Serilog.Exceptions.EntityFrameworkCore.Destructurers;
using Serilog.Settings.Configuration;
using Serilog.Sinks.AwsCloudWatch;
using Serilog.Sinks.OpenTelemetry;

namespace Infrastructure.Logging;

public static partial class LoggingExtensions
{
    public static WebApplicationBuilder ConfigureSerilog(this WebApplicationBuilder builder)
    {
        var appName =
            builder.Configuration.GetValue<string>("App:Name")
            ?? Assembly.GetEntryAssembly()?.GetName().Name;
        ArgumentNullException.ThrowIfNull(appName);

        IWebHostEnvironment environment = builder.Environment;
        ConfigurationManager config = builder.Configuration;
        _ = builder.Host.UseSerilog(
            (_, _, loggerConfig) =>
            {
                loggerConfig.Enrich
                    .FromLogContext()
                    .Enrich.WithProperty("Application", appName)
                    .Enrich.WithExceptionDetails(
                        new DestructuringOptionsBuilder()
                            .WithDefaultDestructurers()
                            .WithDestructurers(new[] { new DbUpdateExceptionDestructurer() })
                    )
                    .Enrich.WithMachineName()
                    .Enrich.WithProcessId()
                    .Enrich.WithThreadId()
                    .AddApplicationInsightsLogging(config, environment)
                    .ExcludeSources()
                    .WriteTo.Console();

                var seqUrl = environment.IsDevelopment() ? "http://localhost:5341" : "http://seq";
                loggerConfig.WriteTo.Seq(seqUrl);
                // loggerConfig.WriteTo.OpenTelemetry(options =>
                // {
                //     options.Endpoint = "http://localhost:5341/ingest/otlp/v1/logs";
                //     options.Protocol = OtlpProtocol.HttpProtobuf;
                // });

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

    private static LoggerConfiguration ExcludeSources(this LoggerConfiguration loggerConfiguration)
    {
        var excludedSources = new[]
        {
            "Microsoft.AspNetCore.Cors.Infrastructure.CorsService",
            "Microsoft.AspNetCore.Hosting.Diagnostics",
            "Microsoft.AspNetCore.Routing.EndpointMiddleware"
        };

        foreach (var source in excludedSources)
            loggerConfiguration.Filter.ByExcluding(
                @event =>
                    @event.Properties.TryGetValue(
                        "SourceContext",
                        out LogEventPropertyValue? ctxProp
                    ) && ctxProp.ToString().Contains(source)
            );

        return loggerConfiguration;
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

        if (applicationInsightsConnectionString is null)
        {
            Console.Error.WriteLine(
                "No Azure Application Insights connection string found. Logging to Application Insights will not be available."
            );
            return loggerConfiguration;
        }

        loggerConfiguration.WriteTo.ApplicationInsights(
            applicationInsightsConnectionString,
            TelemetryConverter.Traces
        );

        return loggerConfiguration;
    }

    private static LoggerConfiguration AddBlobStorageLogging(
        this LoggerConfiguration loggerConfiguration,
        IConfiguration config,
        IWebHostEnvironment environment
    )
    {
        var blobStorageConnectionString = environment.IsDevelopment()
            ? config["Azure:Storage:ConnectionString"]
            : GetEnvironmentVariable("AZURE_STORAGE_CONNECTION_STRING");

        if (blobStorageConnectionString is null)
        {
            Console.Error.WriteLine(
                "No Azure Storage connection string found. Logging to Azure Blob Storage will not be available."
            );
            return loggerConfiguration;
        }

        loggerConfiguration.WriteTo.AzureBlobStorage(
            blobStorageConnectionString,
            LogEventLevel.Information,
            "logs"
        );

        return loggerConfiguration;
    }
}
