using System.Net;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Text.RegularExpressions;
using FastEndpoints;
using Identity.API.Deprecated.Data;
using Identity.API.Deprecated.Processors;
using Serilog;

namespace Identity.API.Deprecated.Extensions.Application;

public static partial class WebApplicationExtensions
{
    public static WebApplication ConfigurePipeline(this WebApplication app)
    {
        /*app.Use(
            next =>
            {
                return async context =>
                {
          
                    context.Response.OnStarting(
                        () =>
                        {
                            IHeaderDictionary headers = context.Response.Headers;
                            StringValues locationHeaderValue = string.Empty;
                            if (!String.IsNullOrEmpty(context.Response.Headers.Location.ToString()))
                            {
                                // context.Response.Headers.Location.;
                                context.Response.Headers.Remove("location");
                                context.Response.Headers.Add("location", ExtractRedirectUriFromReturnUrl(context.Response.Headers.Location.ToString()!));
                            }
                            Console.WriteLine(ExtractRedirectUriFromReturnUrl(locationHeaderValue!));
                            /*var location = context.Response.Headers.Location.ToString();
                            context.Response.Headers.Location
                            context.Response.Headers.Add("X-ResponseTime-Ms", stopWatch.ElapsedMilliseconds.ToString());#1#
                            return Task.CompletedTask;
                        });

                    await next(context);
                };
            });*/

        app.UseSerilogRequestLogging();
        if (app.Environment.IsDevelopment()) app.UseDeveloperExceptionPage();


        app.UseForwardedHeaders();

        app.UseSerilogRequestLogging();

        app.UseCors("corsPolicy");
        app.UseHttpsRedirection();

        app.UseAuthentication();
        app.UseAuthorization();

        app.UseFastEndpoints(options =>
        {
            options.Endpoints.Configurator = ep => { ep.PreProcessors(Order.Before, new SecurityHeadersProcessor()); };
            options.Endpoints.RoutePrefix = "identity";
            options.Errors.StatusCode = StatusCodes.Status422UnprocessableEntity;
            options.Serializer.Options.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
            options.Serializer.Options.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        });

        app.UseIdentityServer();

        IdentitySeeder.InitializeDatabase(app);
        app.MapEndpoints();

        return app;
    }

    public static string ExtractRedirectUriFromReturnUrl(string url)
    {
        var decodedUrl = WebUtility.HtmlDecode(url);
        var results = Regex.Split(decodedUrl, "redirect_uri=");
        if (results.Length < 2)
            return "";

        var result = results[1];

        string splitKey;
        if (result.Contains("signin-oidc"))
            splitKey = "signin-oidc";
        else
            splitKey = "scope";

        results = Regex.Split(result, splitKey);
        if (results.Length < 2)
            return "";

        result = results[0];

        return result.Replace("%3A", ":").Replace("%2F", "/").Replace("&", "");
    }
}