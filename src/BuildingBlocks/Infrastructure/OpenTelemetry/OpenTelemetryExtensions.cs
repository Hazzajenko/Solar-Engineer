using System.Diagnostics;
using System.Diagnostics.Metrics;
using ApplicationCore.Interfaces;
using Azure.Monitor.OpenTelemetry.Exporter;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using OpenTelemetry.Metrics;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;

namespace Infrastructure.OpenTelemetry;

public record MeterServiceConfiguration(ActivitySource ActivitySource, Meter Meter);

public static class OpenTelemetryExtensions
{
    /// <summary>
    ///     This method is used to initialize the OpenTelemetry.
    ///     It is called from the Program class.
    /// </summary>
    public static IServiceCollection InitOpenTelemetry(
        this IServiceCollection services,
        IConfiguration config,
        IWebHostEnvironment environment,
        MeterServiceConfiguration? meterServiceConfiguration = null
    )
    {
        services.AddApplicationInsightsTelemetry();

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
            // return services;
        }

        ActivitySource activitySource =
            meterServiceConfiguration?.ActivitySource ?? new(serviceName);
        Meter meter = meterServiceConfiguration?.Meter ?? new(serviceName);

        services
            .AddOpenTelemetry()
            .WithTracing(
                tracerProviderBuilder =>
                    tracerProviderBuilder.ConfigureTracerProviderBuilder(
                        config,
                        activitySource,
                        serviceName,
                        applicationInsightsConnectionString
                    )
            )
            .WithMetrics(
                metricsProviderBuilder =>
                    metricsProviderBuilder.ConfigureMeterProviderBuilder(
                        config,
                        meter,
                        serviceName,
                        applicationInsightsConnectionString
                    )
            );

        services.AddAppMetrics();

        return services;
    }

    private static TracerProviderBuilder ConfigureTracerProviderBuilder(
        this TracerProviderBuilder builder,
        IConfiguration config,
        ActivitySource activitySource,
        string serviceName,
        string? applicationInsightsConnectionString = null
    )
    {
        return builder
            .AddSource(activitySource.Name)
            .ConfigureResource(resource => resource.AddService(serviceName))
            .AddHttpClientInstrumentation()
            .AddAspNetCoreInstrumentation()
            .AddOtlpExporter(options =>
            {
                options.Endpoint = new Uri("http://localhost:4317");
            })
            .AddAzureMonitorTraceExporterIfEnabled(config, applicationInsightsConnectionString)
            .AddZipkinExporterIfEnabled(config);
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
        string? applicationInsightsConnectionString = null
    )
    {
        if (applicationInsightsConnectionString is null)
            return builder;
        return builder.AddAzureMonitorTraceExporter(o =>
        {
            o.ConnectionString = applicationInsightsConnectionString;
        });
    }

    private static MeterProviderBuilder ConfigureMeterProviderBuilder(
        this MeterProviderBuilder builder,
        IConfiguration config,
        Meter meter,
        string serviceName,
        string? applicationInsightsConnectionString = null
    )
    {
        return builder
            .ConfigureResource(resource => resource.AddService(serviceName))
            .AddHttpClientInstrumentation()
            .AddAspNetCoreInstrumentation()
            .AddMeter(meter.Name)
            .AddOtlpExporter(options =>
            {
                options.Endpoint = new Uri("http://localhost:4317");
            })
            .AddPrometheusExporter()
            .AddAzureMonitorMetricExporterIfEnabled(config, applicationInsightsConnectionString);
    }

    private static MeterProviderBuilder AddAzureMonitorMetricExporterIfEnabled(
        this MeterProviderBuilder builder,
        IConfiguration config,
        string? applicationInsightsConnectionString = null
    )
    {
        if (applicationInsightsConnectionString is null)
            return builder;
        return builder.AddAzureMonitorMetricExporter(o =>
        {
            o.ConnectionString = applicationInsightsConnectionString;
        });
    }
}
