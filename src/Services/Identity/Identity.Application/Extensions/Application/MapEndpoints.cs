using Microsoft.AspNetCore.Builder;

namespace Identity.Application.Extensions.Application;

public static partial class WebApplicationExtensions
{
    private static WebApplication MapEndpoints(this WebApplication app)
    {
        // app.UseHsts();

        /*if (app.Environment.IsDevelopment())
            app.Use(
                (context, next) =>
                {
                    context.Request.Host = new HostString("solarengineer.net");
                    context.Request.Scheme = "https";
                    return next();
                }
            );
        else
            app.Use(
                (context, next) =>
                {
                    context.Request.Host = new HostString("solarengineer.app");
                    context.Request.Scheme = "https";
                    return next();
                }
            );*/


        return app;
    }
}
