using System.Diagnostics.CodeAnalysis;
using System.Runtime.CompilerServices;
using Microsoft.AspNetCore.SignalR;
using Serilog;

namespace Projects.Application.Extensions;

public static class ProjectItemExtensions
{
    /*
    public static void ThrowIfNull<T>([NJsonSchema.Annotations.NotNull] this T? projectItem)
        where T : IProject
    {
        // if (projectItem is not null) return projectItem;
        if (projectItem is not null)
            return;
        Log.Logger.Error("ProjectItemExtensions.ThrowIfNull: projectItem is null");
        Throw(nameof(projectItem));
        // throw new ArgumentNullException(nameof(projectItem));
    }

    public static void ThrowHubExceptionIfNull<T>(
        [NJsonSchema.Annotations.NotNull] T? projectItem,
        string message
    )
        where T : IProject
    {
        // if (projectItem is not null) return projectItem;
        if (projectItem is not null)
            return;
        // Log.Logger.Error(message, args);
        // if (message is not null) Log.Logger.Error("{Message}", args, message);
        Log.Logger.Error("{Message}", message);
        throw new HubException(message);
        // throw new HubException("User is not apart of this project");
        // Throw(nameof(projectItem));
        // throw new ArgumentNullException(nameof(projectItem));
    }
    */

    public static T ThrowHubExceptionIfNull<T>(
        [NJsonSchema.Annotations.NotNull] T? projectItem,
        string message
    )
    {
        if (projectItem is not null)
            return projectItem;
        Log.Logger.Error("{Message}", message);
        throw new HubException(message);
    }

    public static void ThrowHubException<T>(
        string message
    )
    {
        Log.Logger.Error("{Message}", message);
        throw new HubException(message);
    }

    /*public static void ThrowIfNull<T>(
        [NJsonSchema.Annotations.NotNull] this T? argument,
        [CallerArgumentExpression("argument")] string? paramName = null
    )
        where T : IProject
    {
        if (argument is null) Throw(paramName);
    }*/

    public static void ThrowIfNullV2(
        [NJsonSchema.Annotations.NotNull] object? argument,
        [CallerArgumentExpression("argument")] string? paramName = null
    )
    {
        if (argument is null)
            Throw(paramName);
    }

    [DoesNotReturn]
    internal static void Throw(string? paramName)
    {
        throw new ArgumentNullException(paramName);
    }
    /*public static void ThrowIfNull(this IProject projectItem)
    {
        if (projectItem is null)
        {
            throw new ArgumentNullException(nameof(projectItem));
        }
    }*/
}