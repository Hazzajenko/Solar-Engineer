using Microsoft.Extensions.Logging;

namespace Infrastructure.Logging;

public static partial class LoggingExtensionsBuilder
{
    [LoggerMessage(
        Level = LogLevel.Information,
        EventId = 5001,
        Message = "User {UserName} logged in with provider {Provider}"
    )]
    public static partial void LogUserLoggedIn(
        this ILogger logger,
        string userName,
        string provider
    );
}
