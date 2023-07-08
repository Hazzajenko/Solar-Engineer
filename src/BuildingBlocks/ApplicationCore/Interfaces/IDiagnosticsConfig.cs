using System.Diagnostics;
using System.Diagnostics.Metrics;

namespace ApplicationCore.Interfaces;

public interface IDiagnosticsConfig
{
    string ServiceName { get; set; }
    ActivitySource ActivitySource { get; }
    Meter Meter { get; }
}
