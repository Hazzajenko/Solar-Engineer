using System.IdentityModel.Tokens.Jwt;
using Duende.IdentityServer;
using Infrastructure.Authentication;
using Microsoft.AspNetCore.Authentication;
using Microsoft.IdentityModel.Tokens;

namespace Identity.API.Extensions.Services;

public static class AuthExtensions
{
    public static IServiceCollection InitIdentityAuthConfig(this IServiceCollection services,
        IConfiguration config, IWebHostEnvironment env)
    {
        JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();
        services.AddAuthentication( /*options =>
    {
        // options.DefaultScheme = "JWT_OR_COOKIE";
        // options.DefaultChallengeScheme = "JWT_OR_COOKIE";
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    }*/)
            /*.AddGoogle("google", options =>
            {
                options.SignInScheme = IdentityServerConstants.ExternalCookieAuthenticationScheme;
                options.ClientId = config["Google:ClientId"] ??
                                   throw new ArgumentNullException(nameof(options.ClientId));
                options.ClientSecret = config["Google:ClientSecret"] ??
                                       throw new ArgumentNullException(nameof(options.ClientSecret));

                options.ClaimActions.MapJsonKey("urn:google:picture", "picture", "url");
                options.ClaimActions.MapJsonKey(CustomClaims.Picture, "picture", "url");
                options.ClaimActions.MapJsonKey("urn:google:locale", "locale", "string");

                options.SaveTokens = true;

                options.Events.OnCreatingTicket = async ctx =>
                {
                    using var request = new HttpRequestMessage(HttpMethod.Get, ctx.Options.UserInformationEndpoint);
                    request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", ctx.AccessToken);
                    using var result = await ctx.Backchannel.SendAsync(request);
                    var user = await result.Content.ReadFromJsonAsync<JsonElement>();
                    ctx.RunClaimActions(user);
                };
            })*/
            .AddOpenIdConnect("google", "Sign-in with Google", options =>
            {
                options.SignInScheme = IdentityServerConstants.ExternalCookieAuthenticationScheme;
                options.ForwardSignOut = IdentityServerConstants.DefaultCookieAuthenticationScheme;

                options.Authority = "https://accounts.google.com/";
                options.ClientId = config["Google:ClientId"] ??
                                   throw new ArgumentNullException(nameof(options.ClientId));

                // options.Alw
                options.GetClaimsFromUserInfoEndpoint = true;
                options.CallbackPath = "/signin-google";
                options.Scope.Add("email");
                options.Scope.Add("openid");
                options.Scope.Add("profile");
                options.ClaimActions.MapJsonKey("urn:google:picture", "picture", "url");
                options.ClaimActions.MapJsonKey(CustomClaims.Picture, "picture", "url");
                options.ClaimActions.MapJsonKey("urn:google:locale", "locale", "string");
                options.SaveTokens = true;
            })
            .AddOpenIdConnect("oidc", opt =>
            {
                opt.Authority = "https://localhost:6006";
                opt.ClientId = "m2m.client";
                // opt.ClientId = "interactive";
                // opt.ClientId = "client";
                opt.ClientSecret = "secret";
                opt.ResponseType = "code";
                opt.Scope.Clear();
                opt.Scope.Add("sub");
                opt.Scope.Add("openid");
                opt.Scope.Add("name");
                opt.Scope.Add("picture");
                opt.Scope.Add("profile");
                // options.Scope.Add("openid");
                opt.Scope.Add("email");
                // options.Scope.Add("scope1");
                opt.Scope.Add("offline_access");

                // not mapped by default
                opt.ClaimActions.MapUniqueJsonKey("sub", "sub");
                opt.ClaimActions.MapUniqueJsonKey("name", "name");
                // opt.ClaimActions.MapUniqueJsonKey("birthdate", "birthdate");
                opt.ClaimActions.MapJsonKey("picture", "picture");

                // keeps id_token smaller
                // opt.
                opt.GetClaimsFromUserInfoEndpoint = true;

                opt.Scope.Add("toto_api");
                opt.Scope.Add(Constants.StandardScopes.UsersApi);
                opt.UsePkce = true;
                opt.ResponseMode = "query";
                opt.SaveTokens = true;

                opt.TokenValidationParameters = new TokenValidationParameters
                {
                    NameClaimType = "name",
                    RoleClaimType = "role"
                };
            });
        /*.AddOpenIdConnect("oidc", "Demo IdentityServer", options =>
        {
            options.SignInScheme = IdentityServerConstants.ExternalCookieAuthenticationScheme;
            options.SignOutScheme = IdentityServerConstants.SignoutScheme;
            options.SaveTokens = true;

            options.Authority = "https://demo.duendesoftware.com";
            options.ClientId = "client";
            options.ClientSecret = "secret";
            options.ResponseType = "code";

            options.TokenValidationParameters = new TokenValidationParameters
            {
                NameClaimType = "name",
                RoleClaimType = "role"
            };
        });*/


// var authConfig = builder.Services.GetRequiredConfiguration<AuthOptions>();
        services.AddAuthorization(options =>
        {
            /*opt.AddPolicy("RequireAdminRole", policy => policy.RequireRole("Admin"));
            opt.AddPolicy("BeAuthenticated", policy => policy.RequireRole("User"));*/
            options.AddPolicy("ApiScope", policy =>
            {
                policy.RequireAuthenticatedUser();
                // policy.RequireClaim("scope", "users-api");
            });
        });

        // if (env.IsDevelopment()) identityServerBuilder.AddDeveloperSigningCredential();

        return services;
    }
}