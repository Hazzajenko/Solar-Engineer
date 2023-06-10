using System.Globalization;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Infrastructure.Authentication;
using Infrastructure.Extensions;
using Infrastructure.Logging;
using Infrastructure.Settings;
using Mapster;
using Microsoft.AspNetCore.Authentication;
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
            .AddOAuth(
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
            )
            .AddGoogle(
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
            )
            .AddJwtBearer(
                "bearer",
                x =>
                {
                    x.TokenValidationParameters = new TokenValidationParameters
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
                }
            );
        ;

        return services;
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
