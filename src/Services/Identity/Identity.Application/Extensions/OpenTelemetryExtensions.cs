using System.Diagnostics;
using System.Diagnostics.Metrics;
using Azure.Monitor.OpenTelemetry.Exporter;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using OpenTelemetry.Metrics;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;

namespace Identity.Application.Extensions;

public static class OpenTelemetryExtensions
{
    public static IServiceCollection InitOpenTelemetryDeprecated(
        this IServiceCollection services,
        IConfiguration config
    )
    {
        services
            .AddOpenTelemetry()
            .WithTracing(
                tracerProviderBuilder =>
                    tracerProviderBuilder
                        .AddSource(DiagnosticsConfig.ActivitySource.Name)
                        .ConfigureResource(
                            resource => resource.AddService(DiagnosticsConfig.ServiceName)
                        )
                        .AddHttpClientInstrumentation()
                        .AddAspNetCoreInstrumentation()
                        .AddAzureMonitorTraceExporterIfEnabled(config)
                        .AddZipkinExporter(o =>
                        {
                            o.Endpoint = new Uri("http://127.0.0.1:9411/api/v2/spans");
                        })
                        .AddOtlpExporter(
                            options => options.Endpoint = new Uri("http://localhost:4317")
                        )
            )
            .WithMetrics(
                metricsProviderBuilder =>
                    metricsProviderBuilder
                        .ConfigureResource(
                            resource => resource.AddService(DiagnosticsConfig.ServiceName)
                        )
                        .AddHttpClientInstrumentation()
                        .AddAspNetCoreInstrumentation()
                        .AddMeter(DiagnosticsConfig.Meter.Name)
                        .AddMeter("MyApplicationMetrics")
                        .AddAzureMonitorMetricExporterIfEnabled(config)
                        .AddOtlpExporter(
                            options => options.Endpoint = new Uri("http://localhost:4317")
                        )
            );
        return services;
    }

    private static TracerProviderBuilder AddAzureMonitorTraceExporterIfEnabled(
        this TracerProviderBuilder builder,
        IConfiguration config
    )
    {
        var applicationInsightsKey = config["Azure:ApplicationInsights:ConnectionString"];
        if (applicationInsightsKey is null)
            return builder;
        return builder.AddAzureMonitorTraceExporter(o =>
        {
            o.ConnectionString = applicationInsightsKey;
        });
    }

    private static MeterProviderBuilder AddAzureMonitorMetricExporterIfEnabled(
        this MeterProviderBuilder builder,
        IConfiguration config
    )
    {
        var applicationInsightsKey = config["Azure:ApplicationInsights:ConnectionString"];
        if (applicationInsightsKey is null)
            return builder;
        return builder.AddAzureMonitorMetricExporter(o =>
        {
            o.ConnectionString = applicationInsightsKey;
        });
    }
}

public static class DiagnosticsConfig
{
    public const string ServiceName = "IdentityService";
    public static readonly ActivitySource ActivitySource = new(ServiceName);
    public static Meter Meter = new(ServiceName);

    public static Counter<long> RequestCounter = Meter.CreateCounter<long>("app.request_counter");

    // create signalr connection counter
    public static Counter<long> SignalRConnectionCounter = Meter.CreateCounter<long>(
        "app.signalr_connection_counter"
    );
}
