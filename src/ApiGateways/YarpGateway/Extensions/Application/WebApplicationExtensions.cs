using FastEndpoints.Swagger;
using Serilog;

namespace YarpGateway.Extensions.Application;

public static class WebApplicationExtensions
{
    public static WebApplication ConfigurePipeline(this WebApplication app)
    {
        // app.UseForwardedHeaders();

        app.UseSerilogRequestLogging();
        // app.UseCors("corsPolicy");

        // app.UseCookiePolicy();

        /*app.UseFastEndpoints(options =>
        {
            options.Endpoints.RoutePrefix = "users";
            options.Errors.StatusCode = StatusCodes.Status422UnprocessableEntity;
            options.Serializer.Options.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
            options.Serializer.Options.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        });*/


        if (app.Environment.IsDevelopment())
        {
            app.UseOpenApi();
            app.UseSwaggerUi3(x => x.ConfigureDefaults());
        }

        app.UseHttpsRedirection();
        app.UseStaticFiles(); // T
        app.UseRouting();
        app.UseAuthentication();
        app.UseAuthorization();
        // app.UseWebSockets(new WebSocketOptions { KeepAliveInterval = TimeSpan.FromSeconds(120) });
        /*app.MapReverseProxy(config =>
        {
            config.UseSessionAffinity(); // Has no affect on delegation destinations
            config.UseLoadBalancing();
            config.UsePassiveHealthChecks();
            // config.UseHttpSysDelegation();
            config.Use(
                async (context, next) =>
                {
                    var token = await context.GetTokenAsync("access_token");
                    context.Request.Headers["Authorization"] = $"Bearer {token}";

                    await next().ConfigureAwait(false);
                }
            );
        });*/

        // app.UseWebSockets(new WebSocketOptions { KeepAliveInterval = TimeSpan.FromSeconds(120) });
        // app.MapHub<ConnectionsHub>("hubs/connections");

        return app;
    }
}