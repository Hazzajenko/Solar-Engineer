using System.Diagnostics;
using System.Diagnostics.Metrics;

namespace Infrastructure.OpenTelemetry;

public static class DiagnosticsConfig
{
    public const string ServiceName = "IdentityService";
    public static readonly ActivitySource ActivitySource = new(ServiceName);
    public static Meter Meter = new(ServiceName);
    public static Counter<long> RequestCounter = Meter.CreateCounter<long>("app.request_counter");

    public static Counter<long> SignalRConnectionCounter = Meter.CreateCounter<long>(
        "app.signalr_connection_counter"
    );

    public static Histogram<long> RequestDurationHistogram = Meter.CreateHistogram<long>(
        "app.request_duration_histogram"
    );

    public static Histogram<long> SignalRConnectionDurationHistogram = Meter.CreateHistogram<long>(
        "app.signalr_connection_duration_histogram"
    );

    public static Histogram<long> SignalRMessageDurationHistogram = Meter.CreateHistogram<long>(
        "app.signalr_message_duration_histogram"
    );

    public static void Init()
    {
        Meter = new Meter("IdentityService");
        // ServiceName = "";
    }
}