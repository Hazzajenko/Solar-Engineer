namespace Users.API.Extensions;

public static class AuthExtensions
{
    public static IServiceCollection InitIdentityAuth(this IServiceCollection services,
        IConfiguration config, IWebHostEnvironment env)
    {
        services.AddAuthentication("Bearer")
            .AddJwtBearer(options =>
            {
                options.Authority = "https://localhost:6001";
                options.TokenValidationParameters.ValidateAudience = false;
            });
        services.AddAuthorization(options =>
        {
            options.AddPolicy("ApiScope", policy =>
            {
                policy.RequireAuthenticatedUser();
                // policy.RequireClaim("scope", "api1");
            });
        });
        /*services.AddAuthentication(options =>
            {
                options.DefaultScheme = "Cookies";
                options.DefaultChallengeScheme = "oidc";
            }).AddCookie("Cookies")

           .AddOpenIdConnect("oidc", "Demo IdentityServer", options =>
            {
                options.Authority = "https://localhost:6006";

                options.ClientId = "web";
                options.ClientSecret = "secret";
                options.ResponseType = "code";

                options.SaveTokens = true;

                options.Scope.Clear();
                options.Scope.Add("openid");
                options.Scope.Add("profile");
                options.Scope.Add("offline_access");
                options.Scope.Add(Constants.StandardScopes.UsersApi);

                options.GetClaimsFromUserInfoEndpoint = true;
            });*/


// var authConfig = builder.Services.GetRequiredConfiguration<AuthOptions>();
        /*services.AddAuthorization(options =>
        {
            /*opt.AddPolicy("RequireAdminRole", policy => policy.RequireRole("Admin"));
            opt.AddPolicy("BeAuthenticated", policy => policy.RequireRole("User"));#1#
            /*options.AddPolicy("ApiScope", policy =>
            {
                policy.RequireAuthenticatedUser();
                policy.RequireClaim("scope", "users-api");
            });#1#
        });*/

        // if (env.IsDevelopment()) identityServerBuilder.AddDeveloperSigningCredential();

        return services;
    }
}