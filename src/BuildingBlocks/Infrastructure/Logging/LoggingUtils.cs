using ApplicationCore.Interfaces;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Logging;

public static class LoggingUtils
{
    public static ILogger LogScopedAppUser(
        this ILogger logger,
        IAppUser appUser,
        Action<ILogger> action
    )
    {
        using IDisposable? scope = logger.BeginScope(
            new Dictionary<string, object>
            {
                ["UserId"] = appUser.Id,
                ["UserName"] = appUser.UserName,
                ["DisplayName"] = appUser.DisplayName
            }
        );

        action(logger);
        return logger;
    }
}
