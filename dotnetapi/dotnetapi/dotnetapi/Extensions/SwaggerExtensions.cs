using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.OpenApi.Models;

namespace dotnetapi.Extensions;

public static class SwaggerExtensions {
    public static IServiceCollection AddSwaggerServices(this IServiceCollection services, IConfiguration config) {
        services.AddSwaggerGen(option => {
            option.SwaggerDoc("v1", new OpenApiInfo { Title = "Ionic API", Version = "v1" });
            option.TagActionsBy(api => {
                if (api.GroupName != null) return new[] { api.GroupName };

                if (api.ActionDescriptor is ControllerActionDescriptor controllerActionDescriptor) 
                    return new[] { controllerActionDescriptor.ControllerName };

                throw new InvalidOperationException("Unable to determine tag for endpoint.");
            });
            option.DocInclusionPredicate((name, api) => true);
            option.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme {
                In = ParameterLocation.Header,
                Description = "Please enter a valid token",
                Name = "Authorization",
                Type = SecuritySchemeType.Http,
                BearerFormat = "JWT",
                Scheme = "Bearer"
            });
            option.AddSecurityRequirement(new OpenApiSecurityRequirement {
                {
                    new OpenApiSecurityScheme {
                        Reference = new OpenApiReference {
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
        return services;
    }
}