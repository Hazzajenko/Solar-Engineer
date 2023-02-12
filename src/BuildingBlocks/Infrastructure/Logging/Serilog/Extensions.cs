using System.Reflection;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Serilog;
using Serilog.Events;
using Serilog.Exceptions;
using Serilog.Formatting.Compact;

namespace Infrastructure.Logging.Serilog;

public static class Extensions
{
    public static IApplicationBuilder ConfigureSerilog(this IApplicationBuilder app)
    {
        // app.UseSerilogRequestLogging();
        app.UseMiddleware<ExceptionMiddleware>();
        return app;
    }

    public static string RegisterSerilog(this WebApplicationBuilder builder)
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

        // Console.WriteLine(FiggleFonts.Standard.Render(appName!));
        builder.Services.AddScoped<ExceptionMiddleware>();
        // builder.Services.AddScoped<ISerializationService>();

        return appName;
    }
}