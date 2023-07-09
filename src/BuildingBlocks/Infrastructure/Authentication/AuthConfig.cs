using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Net.Http.Headers;

namespace Infrastructure.Authentication;

public static class AuthConfig
{
    public static IServiceCollection AddAuth(
        this IServiceCollection services,
        IConfiguration config
    )
    {
        /*services
            // .AddAuthentication("cookie")
            .AddAuthentication(options =>
            {
                // options.DefaultScheme = "JWT_OR_COOKIE";
                // options.DefaultChallengeScheme = "JWT_OR_COOKIE";
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme, options =>
                // .AddCookie("cookie", options =>
            {
                // options.
                options.LoginPath = "/auth/login";
                // options.Cookie. = true,
                options.Cookie.HttpOnly = true;
                // options.Cookie.SameSite = SameSiteMode.None;
                // options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
            })
            // .AddCookie("cookie", options => { options.Events.OnValidatePrincipal = PrincipalValidator.ValidateAsync; })
            .AddGoogle("google", options =>
            {
                // options.SignInScheme = "bearer";
                options.SignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                // options.SignInScheme = "cookie";
                // options.Re
                // options.CallbackPath = "/auth/login/google";

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

                /*options.Events.OnCreatingTicket = ctx =>
                {
                    var tokens = ctx.Properties.GetTokens().ToList();

                    tokens.Add(new AuthenticationToken
                    {
                        Name = "TicketCreated",
                        Value = DateTime.UtcNow.ToString()
                    });
                    ctx.Properties.StoreTokens(tokens);

                    return Task.CompletedTask;
                };#1#
            })
            .AddOAuth("github", options =>
            {
                // options.SignInScheme = "cookie";
                options.SignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                // CookieAuthenticationDefaults.AuthenticationScheme;

                options.ClientId = config["Github:ClientId"] ??
                                   throw new ArgumentNullException(nameof(options.ClientId));
                options.ClientSecret = config["Github:ClientSecret"] ??
                                       throw new ArgumentNullException(nameof(options.ClientSecret));

                options.AuthorizationEndpoint = "https://github.com/login/oauth/authorize";
                options.TokenEndpoint = "https://github.com/login/oauth/access_token";

                options.CallbackPath = "/oauth/github-cb";
                options.SaveTokens = true;

                options.UserInformationEndpoint = "https://api.github.com/user";

                options.ClaimActions.MapJsonKey("sub", "id");
                options.ClaimActions.MapJsonKey(ClaimTypes.Name, "login");

                options.Events.OnCreatingTicket = async ctx =>
                {
                    using var request = new HttpRequestMessage(HttpMethod.Get, ctx.Options.UserInformationEndpoint);
                    request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", ctx.AccessToken);
                    using var result = await ctx.Backchannel.SendAsync(request);
                    var user = await result.Content.ReadFromJsonAsync<JsonElement>();
                    ctx.RunClaimActions(user);
                };
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey =
                        new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"] ?? string.Empty)),
                    ValidateIssuer = false,
                    ValidateAudience = false
                };

                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        var accessToken = context.Request.Query["access_token"];

                        var path = context.HttpContext.Request.Path;
                        if (!string.IsNullOrEmpty(accessToken) &&
                            path.StartsWithSegments("/hubs"))
                            context.Token = accessToken;

                        return Task.CompletedTask;
                    }
                };
            }).AddPolicyScheme("JWT_OR_COOKIE", "JWT_OR_COOKIE", options =>
            {
                options.ForwardDefaultSelector = context =>
                {
                    string authorization = context.Request.Headers[HeaderNames.Authorization]!;
                    if (!string.IsNullOrEmpty(authorization) && authorization.StartsWith("Bearer "))
                        return JwtBearerDefaults.AuthenticationScheme;

                    return CookieAuthenticationDefaults.AuthenticationScheme;
                };
            });*/


        return services;
    }
}
