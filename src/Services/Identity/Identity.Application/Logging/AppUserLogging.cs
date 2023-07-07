using Identity.Domain;
using Microsoft.Extensions.Logging;

namespace Identity.Application.Logging;


public static partial class AppUserLogging
{
    [LoggerMessage(
        Level = LogLevel.Error,
        EventId = 5001,
        Message = "User Not Found: {UserId}"
    )]
    public static partial void LogUserNotFound(
        this ILogger logger,
        string userId
    );
    
    [LoggerMessage(
        Level = LogLevel.Error,
        EventId = 5002,
        Message = "User Not Found: {UserId} {UserName}"
    )]
    public static partial void LogUserNotFound(
        this ILogger logger,
        string userId,
        string userName
    );
}

