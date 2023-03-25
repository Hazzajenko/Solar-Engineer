using System.Text.Json;
using System.Text.Json.Serialization;
using FastEndpoints;
using Identity.Application.Data.Seed;
using Identity.SignalR.Hubs;
using Infrastructure.Validation;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using Serilog;

namespace Identity.Application.Extensions.Application;

public static partial class WebApplicationExtensions
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
            // app.Swag
            /*app.UseSwaggerUi3(x =>
                {
                    // x.ServerUrl = "https://solarengineer.net/auth-api/";
                    // x.ServerUrl = "https://localhost:5001";
                    // x.
                    // x.Path
                    // x.
                    /*x.SwaggerRoutes.Add(
                        new SwaggerUi3Route("v1", "/swagger/v1/swagger.json")
                        {
                            Name = "Identity API"
                        }
                    );#1#
                }
                // x => x.ConfigureDefaults(z => z.ServerUrl = "https://localhost:5001")
            );*/
            app.UseSwaggerUi3(x =>
            {
                // x.SwaggerRoutes.Add(new SwaggerUi3Route("v1", "/swagger/v1/swagger.json"));
                x.ServerUrl = "https://localhost:5001";
                // x.
            });
        }

        /*
        if (app.Environment.IsDevelopment())
        {
            app.UseOpenApi();
            // app.Swag
            /*app.UseSwaggerUi3(x =>
                {
                    // x.ServerUrl = "https://solarengineer.net/auth-api/";
                    // x.ServerUrl = "https://localhost:5001";
                    // x.
                    // x.Path
                    // x.
                    /*x.SwaggerRoutes.Add(
                        new SwaggerUi3Route("v1", "/swagger/v1/swagger.json")
                        {
                            Name = "Identity API"
                        }
                    );#2#
                }
                // x => x.ConfigureDefaults(z => z.ServerUrl = "https://localhost:5001")
            );#1#
            app.UseSwaggerUi3(x =>
            {
                // x.SwaggerRoutes.Add(new SwaggerUi3Route("v1", "/swagger/v1/swagger.json"));
                x.ServerUrl = "https://localhost:5001";
                // x.
            });
            // app.UseSwaggerUi3(x => x.ConfigureDefaults());
        }
        */

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

        /*app.UseFastEndpoints(options =>
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
        });*/

        /*if (app.Environment.IsDevelopment())
        {
            app.UseOpenApi();
            // app.Swag
            /*app.UseSwaggerUi3(x =>
                {
                    // x.ServerUrl = "https://solarengineer.net/auth-api/";
                    // x.ServerUrl = "https://localhost:5001";
                    // x.
                    // x.Path
                    // x.
                    /*x.SwaggerRoutes.Add(
                        new SwaggerUi3Route("v1", "/swagger/v1/swagger.json")
                        {
                            Name = "Identity API"
                        }
                    );#2#
                }
                // x => x.ConfigureDefaults(z => z.ServerUrl = "https://localhost:5001")
            );#1#
            app.UseSwaggerUi3(x =>
            {
                // x.SwaggerRoutes.Add(new SwaggerUi3Route("v1", "/swagger/v1/swagger.json"));
                x.ServerUrl = "https://localhost:5001";
                // x.
            });
            // app.UseSwaggerUi3(x => x.ConfigureDefaults());
        }*/

        app.UseWebSockets(new WebSocketOptions { KeepAliveInterval = TimeSpan.FromSeconds(120) });
        app.MapHub<ConnectionsHub>("hubs/connections");

        app.UseMiddleware<ValidationMappingMiddleware>();

        IdentityContextSeed.InitializeDatabase(app);

        return app;
    }
}