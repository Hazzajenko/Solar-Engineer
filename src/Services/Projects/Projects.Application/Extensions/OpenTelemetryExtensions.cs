namespace Projects.Application.Extensions;

public static class OpenTelemetryExtensions
{
    /*public static IServiceCollection InitOpenTelemetry(this IServiceCollection services)
    {
        services.AddOpenTelemetry()
            .WithTracing(tracerProviderBuilder =>
                tracerProviderBuilder
                    .AddSource(DiagnosticsConfig.ActivitySource.Name)
                    .ConfigureResource(resource => resource
                        .AddService(DiagnosticsConfig.ServiceName))
                    .AddAspNetCoreInstrumentation()
                    .AddConsoleExporter());
    }*/
}