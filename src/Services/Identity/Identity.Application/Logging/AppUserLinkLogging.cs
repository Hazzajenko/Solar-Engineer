using Identity.Domain;
using Microsoft.Extensions.Logging;

namespace Identity.Application.Logging;

public static partial class AppUserLinkLogging
{
    [LoggerMessage(
        Level = LogLevel.Error,
        Message = "User {UserName}: AppUserLink with AppUserRequested: {AppUserRequestedUserName}, AppUserReceived: {AppUserReceivedUserName} not found. Cannot accept reject request. Creating new AppUserLink..."
    )]
    public static partial void LogAppUserLinkNotFound(
        this ILogger logger,
        string userName,
        string appUserRequestedUserName,
        string appUserReceivedUserName
    );

    [LoggerMessage(
        Level = LogLevel.Error,
        Message = "User {UserName}: Created new AppUserLink with AppUserRequested: {AppUserRequestedUserName}, AppUserReceived: {AppUserReceivedUserName}"
    )]
    public static partial void LogAppUserLinkCreated(
        this ILogger logger,
        string userName,
        string appUserRequestedUserName,
        string appUserReceivedUserName
    );
}
