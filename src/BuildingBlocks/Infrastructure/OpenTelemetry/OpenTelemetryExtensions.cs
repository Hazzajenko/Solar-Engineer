using System.Diagnostics;
using System.Diagnostics.Metrics;
using Azure.Monitor.OpenTelemetry.Exporter;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using OpenTelemetry.Metrics;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;

namespace Infrastructure.OpenTelemetry;

public static class OpenTelemetryExtensions
{
    // public const string ServiceName = "IdentityService";

    // public static readonly ActivitySource ActivitySource = new(ServiceName);
    // public static Meter Meter = new(ServiceName);
    public static IServiceCollection InitOpenTelemetry(
        this IServiceCollection services,
        IConfiguration config
    )
    {
        var serviceName = config["App:ServiceName"];
        ArgumentNullException.ThrowIfNull(serviceName, nameof(serviceName));
        ActivitySource activitySource = new(serviceName);
        Meter meter = new(serviceName);

        services
            .AddOpenTelemetry()
            .WithTracing(
                tracerProviderBuilder =>
                    tracerProviderBuilder.ConfigureTracerProviderBuilder(config, activitySource)
            )
            .WithMetrics(
                metricsProviderBuilder =>
                    metricsProviderBuilder.ConfigureMeterProviderBuilder(config, meter)
            );
        return services;
    }

    private static TracerProviderBuilder ConfigureTracerProviderBuilder(
        this TracerProviderBuilder builder,
        IConfiguration config,
        ActivitySource activitySource
    )
    {
        return builder
            .AddSource(activitySource.Name)
            .ConfigureResource(resource => resource.AddService(DiagnosticsConfig.ServiceName))
            .AddHttpClientInstrumentation()
            .AddAspNetCoreInstrumentation()
            .AddAzureMonitorTraceExporterIfEnabled(config)
            .AddZipkinExporterIfEnabled(config);
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
        return builder.AddZipkinExporter(o => { o.Endpoint = new Uri(zipkinUrl); });
    }

    private static TracerProviderBuilder AddAzureMonitorTraceExporterIfEnabled(
        this TracerProviderBuilder builder,
        IConfiguration config
    )
    {
        var applicationInsightsKey = config["Azure:ApplicationInsights:ConnectionString"];
        if (applicationInsightsKey is null)
            return builder;
        return builder.AddAzureMonitorTraceExporter(o => { o.ConnectionString = applicationInsightsKey; });
    }

    private static MeterProviderBuilder ConfigureMeterProviderBuilder(
        this MeterProviderBuilder builder,
        IConfiguration config,
        Meter meter
    )
    {
        return builder
            .ConfigureResource(resource => resource.AddService(DiagnosticsConfig.ServiceName))
            .AddHttpClientInstrumentation()
            .AddAspNetCoreInstrumentation()
            .AddMeter(meter.Name)
            // .AddMeter("MyApplicationMetrics")
            .AddAzureMonitorMetricExporterIfEnabled(config);
        /*.AddOtlpExporter(
            options => options.Endpoint = new Uri("http://localhost:4317")
        )*/
    }

    private static MeterProviderBuilder AddAzureMonitorMetricExporterIfEnabled(
        this MeterProviderBuilder builder,
        IConfiguration config
    )
    {
        var applicationInsightsKey = config["Azure:ApplicationInsights:ConnectionString"];
        if (applicationInsightsKey is null)
            return builder;
        return builder.AddAzureMonitorMetricExporter(o => { o.ConnectionString = applicationInsightsKey; });
    }
}