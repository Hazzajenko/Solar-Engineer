﻿using System.Diagnostics.CodeAnalysis;
using System.Runtime.CompilerServices;
using Projects.API.Data;
using Serilog;

namespace Projects.API.Extensions;

public static class ProjectItemExtensions
{
    public static T ThrowIfNull<T>([NJsonSchema.Annotations.NotNull] this T? projectItem)
        where T : IProject
    {
        // if (projectItem is not null) return projectItem;
        if (projectItem is not null) return projectItem;
        Log.Logger.Error("ProjectItemExtensions.ThrowIfNull: projectItem is null");
        throw new ArgumentNullException(nameof(projectItem));
    }
    /*public static void ThrowIfNull<T>(
        [NJsonSchema.Annotations.NotNull] this T? argument,
        [CallerArgumentExpression("argument")] string? paramName = null
    )
        where T : IProject
    {
        if (argument is null) Throw(paramName);
    }*/

    public static void ThrowIfNullV2([NJsonSchema.Annotations.NotNull] object? argument,
        [CallerArgumentExpression("argument")] string? paramName = null)
    {
        if (argument is null) Throw(paramName);
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