using System.Diagnostics.CodeAnalysis;
using System.Runtime.CompilerServices;
using FluentValidation;
using FluentValidation.Results;
using Serilog;

namespace Projects.API.Exceptions;

public class ProjectsException : Exception
{
    public ProjectsException(string name, object key)
        : base($"Entity \"{name}\" ({key}) was not found.")
    {
    }

    public static void ThrowIfNull([NJsonSchema.Annotations.NotNull] object? argument,
        [CallerArgumentExpression("argument")] string? paramName = null)
    {
        if (argument is null)
        {
            Log.Logger.Error("ArgumentNullException: {paramName}", paramName);
            Throw(paramName);
        }
    }

    [DoesNotReturn]
    internal static void Throw2(string? paramName, string message)
    {
        Log.Logger.Error("NullException: {ParamName}", paramName);
        throw new ValidationException(message, new[]
        {
            new ValidationFailure(paramName, message)
        });
    }


    [DoesNotReturn]
    internal static void Throw(string? paramName)
    {
        throw new ArgumentNullException(paramName);
    }
}