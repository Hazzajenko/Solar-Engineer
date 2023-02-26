using System.Text.Json;
using System.Text.Json.Serialization;
using FastEndpoints;
using FastEndpoints.Swagger;
using Messages.API.Hubs;
using Serilog;

namespace Messages.API.Extensions.Application;

public static class WebApplicationExtensions
{
    public static WebApplication ConfigurePipeline(this WebApplication app)
    {
        app.UseForwardedHeaders();
        app.UseSerilogRequestLogging();
        app.UseCors("corsPolicy");
        app.UseAuthentication();
        app.UseAuthorization();

        app.UseFastEndpoints(options =>
        {
            options.Endpoints.RoutePrefix = "messages";
            options.Errors.StatusCode = StatusCodes.Status422UnprocessableEntity;
            options.Serializer.Options.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
            options.Serializer.Options.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        });

        if (app.Environment.IsDevelopment())
        {
            app.UseOpenApi();
            app.UseSwaggerUi3(x => x.ConfigureDefaults());
        }

        app.MapHub<MessagesHub>("hubs/messages");

        return app;
    }
}