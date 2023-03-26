using System.Diagnostics;
using System.Diagnostics.Metrics;
using Azure.Monitor.OpenTelemetry.Exporter;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using OpenTelemetry.Metrics;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;

namespace Identity.Application.Extensions.ServiceCollection;

public static class OpenTelemetryExtensions
{
    public static IServiceCollection InitOpenTelemetryDeprecated(
        this IServiceCollection services,
        IConfiguration config
    )
    {
        /*var applicationInsightsKey = config["Azure:ApplicationInsights:ConnectionString"];*/

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
                        // .
                        // .AddE
                        /*.AddEventCountersInstrumentation(c =>
                        {
                            // https://learn.microsoft.com/en-us/dotnet/core/diagnostics/available-counters?WT.mc_id=DT-MVP-5003978
                            c.AddEventSources(
                                "Microsoft.AspNetCore.Hosting",
                                "System.Net.Http",
                                "System.Net.Sockets",
                                "System.Net.NameResolution",
                                "System.Net.Security");
                        })*/
                        // .AddZipkinExporter(o => { o.Endpoint = new Uri("http://0.0.0.0:9411"); })
                        .AddZipkinExporter(o => { o.Endpoint = new Uri("http://127.0.0.1:9411/api/v2/spans"); })
                        .AddOtlpExporter(
                            options => options.Endpoint = new Uri("http://localhost:4317")
                        )
                /*.AddJaegerExporter(opt =>
                {
                    opt.Endpoint = new Uri("http://127.0.0.1:16686");
                    opt.AgentHost = "localhost";
                    opt.AgentPort = 6831;
                    opt.Protocol = JaegerExportProtocol.UdpCompactThrift;
                })*/
                /*
                .AddJaegerExporter(o => { o.AgentHost = "
                */
                /*.AddOtlpExporter(opt =>
                {
                    // opt.Endpoint = new Uri("http://127.0.0.1:4317");
                    opt.Endpoint = new Uri("http://127.0.0.1:16686");
                    opt.Protocol = OtlpExportProtocol.HttpProtobuf;
                })*/
                // api/v2/spans
                // .AddConsoleExporter()
            )
            // http://127.0.0.1:9411/
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
                        // .Add
                        /*.AddEventCountersInstrumentation(c =>
                        {
                            // https://learn.microsoft.com/en-us/dotnet/core/diagnostics/available-counters?WT.mc_id=DT-MVP-5003978
                            c.AddEventSources(
                                "Microsoft.AspNetCore.Hosting",
                                "System.Net.Http",
                                "System.Net.Sockets",
                                "System.Net.NameResolution",
                                "System.Net.Security");
                        })*/
                        // .Add
                        .AddOtlpExporter(
                            options => options.Endpoint = new Uri("http://localhost:4317")
                        )
                // .Add
                // .AddConsoleExporter()
            );
        /*services.AddHttpClient(
            "JaegerExporter",
            client =>
                client.DefaultRequestHeaders.Add("X-MyCustomHeader", "value")
        );*/
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
        return builder.AddAzureMonitorTraceExporter(o => { o.ConnectionString = applicationInsightsKey; });
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

public static class DiagnosticsConfig
{
    public const string ServiceName = "IdentityService";
    public static readonly ActivitySource ActivitySource = new(ServiceName);
    public static Meter Meter = new(ServiceName);

    public static Counter<long> RequestCounter = Meter.CreateCounter<long>("app.request_counter");

    // create signalr connection counter
    public static Counter<long> SignalRConnectionCounter = Meter.CreateCounter<long>("app.signalr_connection_counter");
}