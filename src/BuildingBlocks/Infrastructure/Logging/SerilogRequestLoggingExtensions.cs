using ApplicationCore.Extensions;
using Microsoft.AspNetCore.Builder;
using Serilog;

namespace Infrastructure.Logging;

public static class SerilogRequestLoggingExtensions
{
    public static WebApplication ConfigureSerilogRequestLogging(this WebApplication application)
    {
        application.UseSerilogRequestLogging(options =>
        {
            options.MessageTemplate =
                "HTTP {RequestMethod} {RequestPath} responded {StatusCode} in {Elapsed:0.0000} ms";
            options.EnrichDiagnosticContext = (diagnosticContext, httpContext) =>
            {
                diagnosticContext.Set("UserId", httpContext.User.GetUserId());
                diagnosticContext.Set("UserName", httpContext.User.GetUserName());
                diagnosticContext.Set(
                    "IsAuthenticated",
                    httpContext.User.Identity?.IsAuthenticated
                );
            };
        });
        return application;
    }
}
