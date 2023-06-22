using System.Globalization;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using IdentityModel.Client;
using Infrastructure.Authentication;
using Infrastructure.Extensions;
using Infrastructure.Logging;
using Infrastructure.Settings;
using Mapster;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authentication.OAuth.Claims;
using Microsoft.IdentityModel.Tokens;

namespace Identity.API.Extensions;

public static class AuthenticationExtensions
{
    public static IServiceCollection InitAuthentication(
        this IServiceCollection services,
        IConfiguration config,
        IWebHostEnvironment environment,
        JwtSettings jwtSettings
    )
    {
        services
            .AddAuthentication()
            // .AddGithub(config, environment)
            .AddGoogleAuth(config, environment)
            .AddMicrosoftAuth(config, environment)
            .AddJwtBearer(
                "bearer",
                options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        IssuerSigningKey = new SymmetricSecurityKey(
                            Encoding.UTF8.GetBytes(jwtSettings.Key)
                        ),
                        ValidateIssuerSigningKey = true,
                        ValidateLifetime = true,
                        ValidIssuer = jwtSettings.Issuer,
                        ValidAudience = jwtSettings.Audience,
                        ValidateIssuer = true,
                        ValidateAudience = true
                    };
                    
                    
                    options.Events = new JwtBearerEvents
                    {
                        OnMessageReceived = context =>
                        {
                            var accessToken = context.Request.Query["access_token"];

                            var path = context.HttpContext.Request.Path;
                            if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hubs"))
                                context.Token = accessToken;

                            return Task.CompletedTask;
                        }
                    };
                }
            );
        ;

        return services;
    }

    private static AuthenticationBuilder AddGoogleAuth(
        this AuthenticationBuilder builder,
        IConfiguration config,
        IWebHostEnvironment environment
    )
    {
        builder.AddGoogle(
            "google",
            options =>
            {
                var googleSettings = GetGoogleSettings(config, environment);
                options.ClientId = googleSettings.ClientId;
                options.ClientSecret = googleSettings.ClientSecret;

                options.ClaimActions.MapJsonKey(CustomClaims.Picture, "picture", "url");
                options.SaveTokens = true;

                options.Events.OnCreatingTicket = ctx =>
                {
                    var tokens = ctx.Properties.GetTokens().ToList();

                    tokens.Add(
                        new AuthenticationToken
                        {
                            Name = "TicketCreated",
                            Value = DateTime.UtcNow.ToString(CultureInfo.CurrentCulture)
                        }
                    );
                    ctx.Properties.StoreTokens(tokens);
                    foreach (var (key, value) in ctx.Properties.Items)
                        Console.WriteLine($"{key} {value}");

                    var googleProperty = ctx.Properties.Items.SingleOrDefault(
                        x => x is { Key: "LoginProvider", Value: "google" }
                    );
                    if (googleProperty.Value is null)
                        ctx.Properties.Items.Add(
                            new KeyValuePair<string, string?>("LoginProvider", "google")
                        );

                    return Task.CompletedTask;
                };
            }
        );
        return builder;
    }

    private static AuthenticationBuilder AddMicrosoftAuth(
        this AuthenticationBuilder builder,
        IConfiguration config,
        IWebHostEnvironment environment
    )
    {
        builder.AddMicrosoftAccount(
            "microsoft",
            options =>
            {
                var microsoftSettings = GetMicrosoftSettings(config, environment);
                options.ClientId = microsoftSettings.ClientId;
                options.ClientSecret = microsoftSettings.ClientSecret;

                options.SaveTokens = true;

                options.Events.OnCreatingTicket = async ctx =>
                {
                    using var request = new HttpRequestMessage(
                        HttpMethod.Get,
                        ctx.Options.UserInformationEndpoint
                    );
                    request.Headers.Authorization = new AuthenticationHeaderValue(
                        "Bearer",
                        ctx.AccessToken
                    );
                    using var result = await ctx.Backchannel.SendAsync(request);
                    var user = await result.Content.ReadFromJsonAsync<JsonElement>();
                    ctx.RunClaimActions(user);
                };
            }
        );
        return builder;
    }
    

    private static AuthenticationBuilder AddGithub(
        this AuthenticationBuilder builder,
        IConfiguration config,
        IWebHostEnvironment environment
    )
    {
        builder.AddOAuth(
            "github",
            options =>
            {
                var githubSettings = GetGithubSettings(config, environment);
                options.ClientId = githubSettings.ClientId;
                options.ClientSecret = githubSettings.ClientSecret;

                options.AuthorizationEndpoint = "https://github.com/login/oauth/authorize";
                options.TokenEndpoint = "https://github.com/login/oauth/access_token";
                options.CallbackPath = "/oauth/github-cb";
                options.SaveTokens = true;
                options.UserInformationEndpoint = "https://api.github.com/user";

                options.ClaimActions.MapJsonKey("sub", "id");
                options.ClaimActions.MapJsonKey(ClaimTypes.NameIdentifier, "id");
                options.ClaimActions.MapJsonKey(ClaimTypes.Name, "name");
                options.ClaimActions.MapJsonKey("username", "login");
                options.ClaimActions.MapJsonKey(CustomClaims.Picture, "avatar_url", "url");

                options.Events.OnCreatingTicket = async ctx =>
                {
                    using var request = new HttpRequestMessage(
                        HttpMethod.Get,
                        ctx.Options.UserInformationEndpoint
                    );
                    request.Headers.Authorization = new AuthenticationHeaderValue(
                        "Bearer",
                        ctx.AccessToken
                    );
                    using var result = await ctx.Backchannel.SendAsync(request);
                    var user = await result.Content.ReadFromJsonAsync<JsonElement>();
                    var tokens = ctx.Properties.GetTokens().ToList();
                    var githubProp = ctx.Properties.Items.SingleOrDefault(
                        x => x is { Key: "LoginProvider", Value: "github" }
                    );
                    if (githubProp.Value is null)
                        ctx.Properties.Items.Add(
                            new KeyValuePair<string, string?>("LoginProvider", "github")
                        );
                    ctx.Properties.StoreTokens(tokens);

                    ctx.RunClaimActions(user);
                };
            }
        );
        return builder;
    }

    private static GithubSettings GetGithubSettings(
        IConfiguration config,
        IWebHostEnvironment environment
    )
    {
        GithubSettings settings = environment.IsDevelopment()
            ? new()
            {
                ClientId = config["Github:ClientId"]!,
                ClientSecret = config["Github:ClientSecret"]!
            }
            : new()
            {
                ClientId = DataExtensions.GetEnvironmentVariable("GITHUB_CLIENT_ID"),
                ClientSecret = DataExtensions.GetEnvironmentVariable("GITHUB_CLIENT_SECRET")
            };

        ArgumentNullException.ThrowIfNull(settings.ClientId, nameof(GithubSettings.ClientId));
        ArgumentNullException.ThrowIfNull(
            settings.ClientSecret,
            nameof(GithubSettings.ClientSecret)
        );
        return settings;
    }

    private static GoogleSettings GetGoogleSettings(
        IConfiguration config,
        IWebHostEnvironment environment
    )
    {
        GoogleSettings settings = environment.IsDevelopment()
            ? new()
            {
                ClientId = config["Google:ClientId"]!,
                ClientSecret = config["Google:ClientSecret"]!
            }
            : new()
            {
                ClientId = DataExtensions.GetEnvironmentVariable("GOOGLE_CLIENT_ID"),
                ClientSecret = DataExtensions.GetEnvironmentVariable("GOOGLE_CLIENT_SECRET")
            };

        ArgumentNullException.ThrowIfNull(settings.ClientId, nameof(GoogleSettings.ClientId));
        ArgumentNullException.ThrowIfNull(
            settings.ClientSecret,
            nameof(GoogleSettings.ClientSecret)
        );
        return settings;
    }

    private static MicrosoftSettings GetMicrosoftSettings(
        IConfiguration config,
        IWebHostEnvironment environment
    )
    {
        MicrosoftSettings settings = environment.IsDevelopment()
            ? new()
            {
                ClientId = config["Microsoft:ClientId"]!,
                ClientSecret = config["Microsoft:ClientSecret"]!
            }
            : new()
            {
                ClientId = DataExtensions.GetEnvironmentVariable("MICROSOFT_CLIENT_ID"),
                ClientSecret = DataExtensions.GetEnvironmentVariable("MICROSOFT_CLIENT_SECRET")
            };

        ArgumentNullException.ThrowIfNull(settings.ClientId, nameof(MicrosoftSettings.ClientId));
        ArgumentNullException.ThrowIfNull(
            settings.ClientSecret,
            nameof(MicrosoftSettings.ClientSecret)
        );
        return settings;
    }
}

public class GoogleSettings
{
    public string ClientId { get; set; } = null!;
    public string ClientSecret { get; set; } = null!;
}

public class GithubSettings
{
    public string ClientId { get; set; } = null!;
    public string ClientSecret { get; set; } = null!;
}

public class MicrosoftSettings
{
    public string ClientId { get; set; } = null!;
    public string ClientSecret { get; set; } = null!;
}

public class GithubUser
{
    [JsonPropertyName("login")]
    public string Login { get; set; } = default!;

    [JsonPropertyName("id")]
    public int Id { get; set; } = default!;

    [JsonPropertyName("node_id")]
    public string NodeId { get; set; } = default!;

    [JsonPropertyName("avatar_url")]
    public string AvatarUrl { get; set; } = default!;

    [JsonPropertyName("name")]
    public string Name { get; set; } = default!;
}

/*public static IServiceCollection InitAuthenticationAuth0(this IServiceCollection services)
{
    services
        .AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.Authority = "https://dev-t8co2m74.us.auth0.com/";
            options.Audience = "https://identity.solarengineer.app";
            var certificate = new X509Certificate2("Extensions/dev-t8co2m74.cer");

            options.TokenValidationParameters = new TokenValidationParameters
            {
                NameClaimType = ClaimTypes.NameIdentifier,
                IssuerSigningKeyResolver = (a, b, c, d) =>
                    new List<SecurityKey> { new X509SecurityKey(certificate) },
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
            };
        });
    return services;
}*/
