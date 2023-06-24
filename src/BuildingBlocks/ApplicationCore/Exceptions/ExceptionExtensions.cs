using System.Collections;
using System.Diagnostics.CodeAnalysis;
using Serilog;

namespace ApplicationCore.Exceptions;

public static class ExceptionExtensions
{
    public static TObject ThrowExceptionIfNull<TObject, TException>(
        [NotNull] this TObject? projectItem,
        TException exception
    )
        where TObject : notnull
        where TException : Exception
    {
        if (projectItem is not null)
            return projectItem;
        Log.Logger.Error("{Message}", exception.Message);
        // Log.Logger.Error("{StackTrace}", exception.StackTrace);
        Log.Logger.Error("{StackTrace}", exception.GetExceptionMessageWithStackTraceAndData());
        // Log.Logger.Error("{StackTrace}", GetExceptionMessageWithStackTraceAndData(exception));
        throw exception;
    }

    private static string GetExceptionMessageWithStackTraceAndData(this Exception exception)
    {
        var message = exception.Message;
        if (exception.InnerException != null)
            message +=
                Environment.NewLine
                + GetExceptionMessageWithStackTraceAndData(exception.InnerException);
        message += Environment.NewLine + exception.StackTrace;
        foreach (DictionaryEntry data in exception.Data)
            message += Environment.NewLine + data.Key + ": " + data.Value;
        message += Environment.NewLine + exception.Source;
        message += Environment.NewLine + exception.TargetSite;
        message += Environment.NewLine + exception.HelpLink;
        message += Environment.NewLine + exception.HResult;
        message += Environment.NewLine + exception.Source;
        return message;
    }
}
