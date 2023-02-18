using System.Net;
using System.Text.Json;
using Infrastructure.Common;
using Infrastructure.Exceptions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Serilog;
using Serilog.Context;

namespace Infrastructure.Logging.Serilog;

public class ExceptionMiddleware : IMiddleware
{

    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        try
        {
            await next(context);
        }
        catch (Exception exception)
        {
            var errorId = Guid.NewGuid().ToString();
            LogContext.PushProperty("ErrorId", errorId);
            LogContext.PushProperty("StackTrace", exception.StackTrace!.Trim());
            LogContext.PushProperty("ErrorMessage", exception.Message.Trim());
            LogContext.PushProperty("ErrorType", exception.GetType().FullName);
            var errorResult = new ProblemDetails
            {
                Status = context.Response.StatusCode,
                Type = exception.GetType().FullName,
                Title = exception.GetType().Name,
                Detail = exception.Message.Trim(),
                Instance = errorId
            };
            if (exception is not CustomException && exception.InnerException != null)
                while (exception.InnerException != null)
                    exception = exception.InnerException;

            errorResult.Status = exception switch
            {
                CustomException e => (int)e.StatusCode,
                KeyNotFoundException => (int)HttpStatusCode.NotFound,
                _ => (int?)(int)HttpStatusCode.InternalServerError
            };
            Log.Error("Request failed with Status Code {ErrorStatus} and Error Id {ErrorId}", errorResult.Status, errorId);
            var response = context.Response;
            if (!response.HasStarted)
            {
                response.ContentType = "application/json";
                response.StatusCode = (int)errorResult.Status!;
                await response.WriteAsync(JsonSerializer.Serialize(errorResult));
            }
            else
            {
                Log.Warning("Can't write error response. Response has already started");
            }
        }
    }
}