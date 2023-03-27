using System.Text.Json;
using System.Text.Json.Serialization;
using FastEndpoints;
using Infrastructure.Validation;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using Projects.Application.Data.Seed;
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
            app.UseSwaggerUi3(x => { x.ServerUrl = "https://localhost:5007"; });
        }

        app.UseSerilogRequestLogging();
        app.UseCors("corsPolicy");
        app.UseAuthentication();
        app.UseAuthorization();

        /*
        app.UseFastEndpoints(options =>
        {
            // options.Endpoints.RoutePrefix = "projects";
            options.Errors.StatusCode = StatusCodes.Status422UnprocessableEntity;
            options.Serializer.Options.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
            options.Serializer.Options.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        });*/

        /*if (app.Environment.IsDevelopment())
        {
            app.UseOpenApi();
            app.UseSwaggerUi3(x => x.ConfigureDefaults());
        }*/

        app.MapHub<ProjectsHub>("hubs/projects");

        ProjectsSeeder.InitializeDatabase(app);

        app.UseMiddleware<ValidationMappingMiddleware>();

        return app;
    }
}