using System.Reflection;
using Amazon.CloudWatchLogs;
using Amazon.Runtime.CredentialManagement;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Serilog;
using Serilog.Events;
using Serilog.Exceptions;
using Serilog.Sinks.AwsCloudWatch;

namespace Infrastructure.Logging;

public static partial class LoggingExtensions
{
    public static WebApplicationBuilder ConfigureSerilog(this WebApplicationBuilder builder)
    {
        // var options = new CredentialProfileOptions { AccessKey = "access_key", SecretKey = "secret_key" };
        // var profile = new Amazon.Runtime.CredentialManagement.CredentialProfile("basic_profile", options);
        // profile.Region = GetBySystemName("eu-west-1"); // OR RegionEndpoint.EUWest1
        // var netSDKFile = new NetSDKCredentialsFile();
        // netSDKFile.RegisterProfile(profile);


        var appName =
            builder.Configuration.GetValue<string>("App:Name")
            ?? Assembly.GetEntryAssembly()?.GetName().Name;
        if (appName is null)
            throw new ArgumentNullException(nameof(appName));
        // builder.Configuration.AddEnvironmentVariables()
        _ = builder.Host.UseSerilog(
            (_, _, loggerConfig) =>
            {
                // ReadFrom.Configuration(IConfiguration configuration, ConfigurationReaderOptions readerOptions)
                /*loggerConfig.ReadFrom
                    .Configuration( )
                    .Enrich.FromLogContext()
                    .Enrich.WithProperty("Application", appName)
                    .Enrich.WithExceptionDetails()
                    .Enrich.WithMachineName()
                    .Enrich.WithProcessId()
                    .Enrich.WithThreadId()
                    .Enrich.FromLogContext()
                    .WriteTo.Console();*/
                loggerConfig.ReadFrom
                    .Configuration(builder.Configuration, "Logging")
                    .Enrich.FromLogContext()
                    .Enrich.WithProperty("Application", appName)
                    .Enrich.WithExceptionDetails()
                    .Enrich.WithMachineName()
                    .Enrich.WithProcessId()
                    .Enrich.WithThreadId()
                    .Enrich.FromLogContext()
                    // .WriteTo.AmazonCloudWatch(
                    //     logGroup: $"{builder.Environment.EnvironmentName}/{builder.Environment.ApplicationName}",
                    //     createLogGroup: true,
                    //     logStreamPrefix: DateTime.UtcNow.ToString("yyyyMMddHHmmssfff"),
                    //     cloudWatchClient: new AmazonCloudWatchLogsClient()
                    // )
                    .WriteTo.Console();

                loggerConfig.WriteTo.Seq("http://localhost:5341");

                /*loggerConfig.WriteTo.File(
                    new CompactJsonFormatter(),
                    "Logs/log.json",
                    LogEventLevel.Information,
                    rollingInterval: RollingInterval.Day,
                    retainedFileCountLimit: 5
                );*/

                loggerConfig.MinimumLevel
                    .Override("Microsoft", LogEventLevel.Information)
                    // .Override("Microsoft", LogEventLevel.Warning)
                    // .MinimumLevel.Override("Microsoft.Hosting.Lifetime", LogEventLevel.Information)
                    .MinimumLevel.Override(
                        "Microsoft.AspNetCore.SignalR",
                        LogEventLevel.Information
                    )
                    .MinimumLevel.Override(
                        "Microsoft.AspNetCore.Http.Connections",
                        LogEventLevel.Information
                    )
                    // .MinimumLevel.Override(
                    //     "Microsoft.EntityFrameworkCore",
                    //     LogEventLevel.Information
                    // );
                    .MinimumLevel.Override("Microsoft.EntityFrameworkCore", LogEventLevel.Error);

                /*logging.AddFilter("Microsoft.AspNetCore.SignalR", LogLevel.Debug);
                logging.AddFilter("Microsoft.AspNetCore.Http.Connections", LogLevel.Debug);*/
            }
        );

        return builder;
    }
}
