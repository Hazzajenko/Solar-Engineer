using System.Text.Json;
using System.Text.Json.Serialization;
using FastEndpoints;
using Infrastructure.Logging;
using Infrastructure.Validation;
using Infrastructure.Web;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using Projects.Application.Data.Seed;
using Projects.Application.Middleware;
using Projects.Contracts.Data;
using Projects.SignalR.Hubs;
using Serilog;

namespace Projects.Application.Extensions;

public static class WebApplicationExtensions
{
    public static WebApplication ConfigurePipeline(this WebApplication app)
    {
        app.UseForwardedHeaders();

        app.UseFastEndpoints(options =>
        {
            options.Errors.StatusCode = StatusCodes.Status422UnprocessableEntity;
            options.Serializer.Options.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
            options.Serializer.Options.ReferenceHandler = ReferenceHandler.IgnoreCycles;
            options.Endpoints.Filter = ep => ep.EndpointTags?.Contains("Deprecated") is not true;
            options.Serializer.Options.Converters.Add(new JsonStringEnumConverter());
            options.Serializer.Options.Converters.Add(new ProjectTemplateKeyConverter());
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
                x.ServerUrl = "https://localhost:5007";
            });
        }

        // app.ConfigureSerilogRequestLogging();
        app.UseCors(CorsConfig.CorsPolicy);
        app.UseAuthentication();
        app.UseAuthorization();
        app.UseHttpsRedirection();
        app.MapHealthChecks("/healthz");

        app.MapHub<ProjectsHub>("hubs/projects");
        app.UseMiddleware<ValidationMappingMiddleware>();
        app.UseMiddleware<ProjectRequestLoggingMiddleware>();

        ProjectsSeeder.InitializeDatabase(app);

        return app;
    }
}
