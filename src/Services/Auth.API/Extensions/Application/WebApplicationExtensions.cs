using System.Text.Json;
using System.Text.Json.Serialization;
using Auth.API.Services;
using FastEndpoints;
using FastEndpoints.Swagger;
using Infrastructure.Logging.Serilog;
using Serilog;

namespace Auth.API.Extensions.Application;

public static partial class WebApplicationExtensions
{
    public static WebApplication ConfigurePipeline(this WebApplication app)
    {
        app.UseForwardedHeaders();

        if (app.Environment.IsDevelopment()) app.UseDefaultExceptionHandler();

        app.UseSerilogRequestLogging();
        app.ConfigureSerilog();

        app.UseCors("corsPolicy");
        app.UseHttpsRedirection();

        app.UseAuthentication();
        app.UseAuthorization();
        app.UseCookiePolicy(
            new CookiePolicyOptions
            {
                Secure = CookieSecurePolicy.Always,
                MinimumSameSitePolicy = SameSiteMode.Strict
            });


        app.MapGrpcService<AppUsersGrpcService>();


        app.MapEndpoints();

        app.UseFastEndpoints(options =>
        {
            options.Endpoints.RoutePrefix = "auth";
            options.Errors.StatusCode = StatusCodes.Status422UnprocessableEntity;
            options.Serializer.Options.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
            options.Serializer.Options.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        });

        if (app.Environment.IsDevelopment())
        {
            app.UseOpenApi();
            app.UseSwaggerUi3(x => x.ConfigureDefaults());
        }

        return app;
    }
}