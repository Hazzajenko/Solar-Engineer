using System.Reflection;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Serilog;
using Serilog.Events;
using Serilog.Exceptions;
using Serilog.Formatting.Compact;

namespace Infrastructure.Logging;

public static class LoggingExtensions
{
    public static WebApplicationBuilder ConfigureSerilog(this WebApplicationBuilder builder)
    {
        var appName = builder.Configuration.GetValue<string>("App:Name") ?? Assembly.GetEntryAssembly()?.GetName().Name;
        if (appName is null) throw new ArgumentNullException(nameof(appName));
        _ = builder.Host.UseSerilog((_, _, loggerConfig) =>
        {
            loggerConfig
                .ReadFrom.Configuration(builder.Configuration, "Logging")
                .Enrich.FromLogContext()
                .Enrich.WithProperty("Application", appName)
                .Enrich.WithExceptionDetails()
                // .Enrich.WithMachineName()
                // .Enrich.WithProcessId()
                // .Enrich.WithThreadId()
                .Enrich.FromLogContext().WriteTo.Console();

            loggerConfig.WriteTo.File(new CompactJsonFormatter(), "Logs/logs.json",
                LogEventLevel.Information,
                rollingInterval: RollingInterval.Day,
                retainedFileCountLimit: 5);

            loggerConfig
                .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
                .MinimumLevel.Override("Microsoft.Hosting.Lifetime", LogEventLevel.Information)
                .MinimumLevel.Override("Microsoft.EntityFrameworkCore", LogEventLevel.Error);
        });

        return builder;
    }
}