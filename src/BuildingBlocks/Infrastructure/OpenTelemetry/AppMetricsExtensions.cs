﻿using App.Metrics;
using App.Metrics.Formatters.Prometheus;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Prometheus;

namespace Infrastructure.OpenTelemetry;

public static class AppMetricsExtensions
{
    public static IServiceCollection AddAppMetrics(this IServiceCollection services)
    {
        // IMetricsRoot? metrics = AppMetrics
        //     .CreateDefaultBuilder()
        //     .OutputMetrics.AsPrometheusPlainText()
        //     .Build();
        //
        // services.AddMetrics(metrics);
        // services.AddMetricsTrackingMiddleware();
        // services.AddMetricsEndpoints(options =>
        // {
        //     options.MetricsEndpointOutputFormatter = metrics.OutputMetricsFormatters
        //         .OfType<MetricsPrometheusTextOutputFormatter>()
        //         .First();
        // });

        return services;
    }

    public static WebApplication UseAppMetrics(this WebApplication app)
    {
        app.UseHttpMetrics();
        app.MapMetrics();

        return app;
    }
}
