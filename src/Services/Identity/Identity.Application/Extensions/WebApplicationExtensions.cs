using System.Security.Cryptography.X509Certificates;
using System.Text.Json;
using System.Text.Json.Serialization;
using ApplicationCore.Extensions;
using ApplicationCore.Middleware;
using FastEndpoints;
using Identity.Application.Data.Seed;
using Identity.Application.Middleware;
using Identity.SignalR.Hubs;
using Infrastructure.Logging;
using Infrastructure.Validation;
using Infrastructure.Web;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Logging;
using Microsoft.IdentityModel.Tokens;
using Serilog;

namespace Identity.Application.Extensions;

public static partial class WebApplicationExtensions
{
    public static WebApplication ConfigurePipeline(this WebApplication app)
    {
        app.UseForwardedHeaders();

        app.UseFastEndpoints(options =>
        {
            options.Errors.StatusCode = StatusCodes.Status422UnprocessableEntity;
            options.Serializer.Options.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
            // options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve);
            // options.Serializer.Options.ReferenceHandler = ReferenceHandler.Preserve;
            options.Serializer.Options.ReferenceHandler = ReferenceHandler.IgnoreCycles;
            options.Endpoints.Filter = ep => ep.EndpointTags?.Contains("Deprecated") is not true;
            options.Errors.ResponseBuilder = (failures, ctx, statusCode) =>
            {
                return new ValidationProblemDetails(
                    failures
                        .GroupBy(f => f.PropertyName)
                        .ToDictionary(e => e.Key, e => e.Select(m => m.ErrorMessage).ToArray())
                )
                {
                    Type = "https://tools.ietf.org/html/rfc7231#section-6.5.1",
                    Title = "One or more validation errors occurred.",
                    Status = statusCode,
                    Instance = ctx.Request.Path,
                    Extensions = { { "traceId", ctx.TraceIdentifier } }
                };
            };
        });

        if (app.Environment.IsDevelopment())
        {
            app.UseDefaultExceptionHandler();
            app.UseOpenApi();
            app.UseSwaggerUi3(x =>
            {
                x.ServerUrl = "https://localhost:5001";
            });
            IdentityModelEventSource.ShowPII = true;
        }

        app.ConfigureSerilogRequestLogging();

        app.UseCors(CorsConfig.CorsPolicy);
        app.UseHttpsRedirection();

        app.UseAuthentication();
        app.UseAuthorization();

        app.MapHealthChecks("/healthz");
        app.MapHub<UsersHub>("hubs/users");

        app.UseMiddleware<ValidationMappingMiddleware>();
        app.UseHttpRequestLoggingMiddleware();
        app.UseLastActiveMiddleware();

        IdentityContextSeed.InitializeDatabase(app);

        return app;
    }
}
