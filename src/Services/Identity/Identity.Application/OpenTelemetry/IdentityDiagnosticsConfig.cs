using System.Diagnostics;
using System.Diagnostics.Metrics;

namespace Identity.Application.OpenTelemetry;

public static class IdentityDiagnosticsConfig
{
    public const string ServiceName = "IdentityAPI";
    public static readonly ActivitySource ActivitySource = new(ServiceName);
    public static Meter Meter = new(ServiceName);

    public static Counter<long> SignalRConnectionCounter = Meter.CreateCounter<long>(
        "app.signalr_connection_counter"
    );

    public static Histogram<long> SignalRConnectionDurationHistogram = Meter.CreateHistogram<long>(
        "app.signalr_connection_duration_histogram"
    );
}