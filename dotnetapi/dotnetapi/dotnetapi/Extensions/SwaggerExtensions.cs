using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.OpenApi.Models;

namespace dotnetapi.Extensions;

public static class SwaggerExtensions
{
    public static IServiceCollection AddSwaggerServices(this IServiceCollection services, IConfiguration config)
    {
        services.AddSwaggerGen(option =>
        {
            // option.ResolveConflictingActions(x => x.Last());
            // option.OperationFilter<SwaggerDefaultValues>();
            /*option.ResolveConflictingActions(x => x.Last());
            option.OperationFilter<SwaggerDefaultValues>();*/

            option.SwaggerDoc("v1", new OpenApiInfo { Title = "SolarEngineer API", Version = "v1" });
            // option.SwaggerDoc("v2", new OpenApiInfo { Title = "SolarEngineer API", Version = "v2" });
            option.TagActionsBy(api =>
            {
                if (api.GroupName != null) return new[] { api.GroupName };

                if (api.ActionDescriptor is ControllerActionDescriptor controllerActionDescriptor)
                    return new[] { controllerActionDescriptor.ControllerName };

                throw new InvalidOperationException("Unable to determine tag for endpoint.");
            });
            option.DocInclusionPredicate((name, api) => true);
            option.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                In = ParameterLocation.Header,
                Description = "Please enter a valid token",
                Name = "Authorization",
                Type = SecuritySchemeType.Http,
                BearerFormat = "JWT",
                Scheme = "Bearer"
            });
            option.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        },
                        Name = "Bearer",
                        In = ParameterLocation.Header
                    },
                    new List<string>()
                }
            });
        });

        /*
        services.AddApiVersioning(opt =>
        {
            opt.DefaultApiVersion = new ApiVersion(1, 0);
            opt.AssumeDefaultVersionWhenUnspecified = true;
            opt.ReportApiVersions = true;
            opt.ApiVersionReader = ApiVersionReader.Combine(new UrlSegmentApiVersionReader(),
                new HeaderApiVersionReader("api-version"),
                new MediaTypeApiVersionReader("api-version"));

            var conv = opt.Conventions.Controller<ProjectsController>();
            conv.HasApiVersion(new ApiVersion(1, 0));
            conv.HasApiVersion(new ApiVersion(2, 0));
        });
        */

        /*
        services.AddVersionedApiExplorer(setup =>
        {
            setup.GroupNameFormat = "'v'VVV";
            setup.SubstituteApiVersionInUrl = true;
        });

        services.AddTransient<IConfigureOptions<SwaggerGenOptions>, ConfigureSwaggerGenOptions>();


        services.ConfigureOptions<ApiVersioningOptions>();*/
        return services;
    }
}