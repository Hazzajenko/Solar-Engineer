using FastEndpoints.Swagger;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using NSwag;

namespace Infrastructure.Swagger;

public record AddAuthSchemeRequest(
    string SchemeName,
    OpenApiSecurityScheme SecurityScheme,
    IEnumerable<string>? GlobalScopeNames = null
);

public static class SwaggerExtensions
{
    public static IServiceCollection InitSwaggerDocs(
        this IServiceCollection services,
        IConfiguration config,
        AddAuthSchemeRequest[]? schemeRequests = null
    )
    {
        var swaggerSettings = config.GetSection("Swagger");
        var name = swaggerSettings["Name"];
        var title = $"{name} API";
        var documentName = $"{name} API v1";
        var version = "v1";

        services.AddSwaggerDoc(settings =>
        {
            settings.DocumentName = documentName;
            settings.Title = title;
            settings.Version = version;
            if (schemeRequests == null)
                return;
            foreach (var schemeRequest in schemeRequests)
                settings.AddAuth(
                    schemeRequest.SchemeName,
                    schemeRequest.SecurityScheme,
                    schemeRequest.GlobalScopeNames
                );
        });

        return services;
    }
}