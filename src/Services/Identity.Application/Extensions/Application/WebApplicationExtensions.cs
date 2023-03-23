using System.Text.Json;
using System.Text.Json.Serialization;
using FastEndpoints;
using FastEndpoints.Swagger;
using Identity.Application.Data.Seed;
using Identity.SignalR.Hubs;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using Serilog;

namespace Identity.Application.Extensions.Application;

public static partial class WebApplicationExtensions
{
    public static WebApplication ConfigurePipeline(this WebApplication app)
    {
        app.UseForwardedHeaders();

        if (app.Environment.IsDevelopment())
            app.UseDefaultExceptionHandler();

        app.UseSerilogRequestLogging();

        app.UseCors("corsPolicy");
        app.UseHttpsRedirection();

        app.UseAuthentication();
        app.UseAuthorization();
        app.UseCookiePolicy(
            new CookiePolicyOptions
            {
                Secure = CookieSecurePolicy.Always,
                MinimumSameSitePolicy = SameSiteMode.Strict
            }
        );

        app.MapEndpoints();

        app.UseFastEndpoints(options =>
        {
            options.Errors.StatusCode = StatusCodes.Status422UnprocessableEntity;
            options.Serializer.Options.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
            options.Serializer.Options.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        });

        if (app.Environment.IsDevelopment())
        {
            app.UseOpenApi();
            app.UseSwaggerUi3(x => x.ConfigureDefaults());
        }

        app.UseWebSockets(new WebSocketOptions { KeepAliveInterval = TimeSpan.FromSeconds(120) });
        app.MapHub<ConnectionsHub>("hubs/connections");

        IdentityContextSeed.InitializeDatabase(app);

        return app;
    }
}