using System.Diagnostics;
using System.Diagnostics.Metrics;
using Azure.Monitor.OpenTelemetry.Exporter;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using OpenTelemetry.Metrics;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;

namespace Infrastructure.OpenTelemetry;

public static class OpenTelemetryExtensions
{
    // public const string ServiceName = "IdentityService";

    // public static readonly ActivitySource ActivitySource = new(ServiceName);
    // public static Meter Meter = new(ServiceName);

    /// <summary>
    ///     This method is used to initialize the OpenTelemetry.
    ///     It is called from the Program class.
    /// </summary>
    public static IServiceCollection InitOpenTelemetry(
        this IServiceCollection services,
        IConfiguration config,
        IWebHostEnvironment environment
    )
    {
        var serviceName = environment.IsDevelopment()
            ? config["App:ServiceName"]
            : GetEnvironmentVariable("APP_SERVICE_NAME");
        ArgumentNullException.ThrowIfNull(serviceName, nameof(serviceName));
        Console.WriteLine($"ServiceName: {serviceName}");

        var applicationInsightsConnectionString = environment.IsDevelopment()
            ? config["Azure:ApplicationInsights:ConnectionString"]
            : GetEnvironmentVariable("AZURE_APPLICATION_INSIGHTS_CONNECTION_STRING");

        if (applicationInsightsConnectionString is null)
        {
            Console.WriteLine("ApplicationInsights is not configured.");
            return services;
        }

        ActivitySource activitySource = new(serviceName);
        Meter meter = new(serviceName);

        services
            .AddOpenTelemetry()
            .WithTracing(
                tracerProviderBuilder =>
                    tracerProviderBuilder.ConfigureTracerProviderBuilder(
                        config,
                        activitySource,
                        applicationInsightsConnectionString
                    )
            )
            .WithMetrics(
                metricsProviderBuilder =>
                    metricsProviderBuilder.ConfigureMeterProviderBuilder(
                        config,
                        meter,
                        applicationInsightsConnectionString
                    )
            );
        return services;
    }

    private static TracerProviderBuilder ConfigureTracerProviderBuilder(
        this TracerProviderBuilder builder,
        IConfiguration config,
        ActivitySource activitySource,
        string applicationInsightsConnectionString
    )
    {
        return builder
            .AddSource(activitySource.Name)
            .ConfigureResource(resource => resource.AddService(DiagnosticsConfig.ServiceName))
            .AddHttpClientInstrumentation()
            .AddAspNetCoreInstrumentation()
            .AddAzureMonitorTraceExporterIfEnabled(config, applicationInsightsConnectionString)
            .AddZipkinExporterIfEnabled(config);
        // .AddSource("Wolverine");
        ;

        /*.AddOtlpExporter(
                       options => options.Endpoint = new Uri("http://localhost:4317")
                   )*/
    }

    private static TracerProviderBuilder AddZipkinExporterIfEnabled(
        this TracerProviderBuilder builder,
        IConfiguration config
    )
    {
        var zipkinUrl = config["Zipkin:Url"];
        if (zipkinUrl is null)
            return builder;
        return builder.AddZipkinExporter(o =>
        {
            o.Endpoint = new Uri(zipkinUrl);
        });
    }

    private static TracerProviderBuilder AddAzureMonitorTraceExporterIfEnabled(
        this TracerProviderBuilder builder,
        IConfiguration config,
        string applicationInsightsConnectionString
    )
    {
        return builder.AddAzureMonitorTraceExporter(o =>
        {
            o.ConnectionString = applicationInsightsConnectionString;
        });
    }

    private static MeterProviderBuilder ConfigureMeterProviderBuilder(
        this MeterProviderBuilder builder,
        IConfiguration config,
        Meter meter,
        string applicationInsightsConnectionString
    )
    {
        return builder
            .ConfigureResource(resource => resource.AddService(DiagnosticsConfig.ServiceName))
            .AddHttpClientInstrumentation()
            .AddAspNetCoreInstrumentation()
            .AddMeter(meter.Name)
            // .AddMeter("MyApplicationMetrics")
            .AddAzureMonitorMetricExporterIfEnabled(config, applicationInsightsConnectionString);
        /*.AddOtlpExporter(
            options => options.Endpoint = new Uri("http://localhost:4317")
        )*/
    }

    private static MeterProviderBuilder AddAzureMonitorMetricExporterIfEnabled(
        this MeterProviderBuilder builder,
        IConfiguration config,
        string applicationInsightsConnectionString
    )
    {
        return builder.AddAzureMonitorMetricExporter(o =>
        {
            o.ConnectionString = applicationInsightsConnectionString;
        });
    }
}
