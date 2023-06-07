using System.Text;
using Identity.Application.Settings;
using Infrastructure.Authentication;
using Infrastructure.Extensions;
using Microsoft.AspNetCore.Authentication;
using Microsoft.IdentityModel.Tokens;

namespace Identity.API.Extensions;

public static class AuthenticationExtensions
{
    public static IServiceCollection InitAuthentication(this IServiceCollection services,
        IConfiguration config, IWebHostEnvironment environment, JwtSettings jwtSettings)
    {
        services
            .AddAuthentication()
            .AddGoogle(
                "google",
                options =>
                {
                    string? googleClientId;
                    string? googleClientSecret;
                    if (environment.IsDevelopment())
                    {
                        googleClientId = config["Google:ClientId"]
                                         ?? throw new ArgumentNullException(nameof(options.ClientId));
                        googleClientSecret = config["Google:ClientSecret"]
                                             ?? throw new ArgumentNullException(nameof(options.ClientSecret));
                    }
                    else
                    {
                        googleClientId = DataExtensions.GetEnvironmentVariable("GOOGLE_CLIENT_ID");
                        googleClientSecret = DataExtensions.GetEnvironmentVariable("GOOGLE_CLIENT_SECRET");
                    }

                    ArgumentNullException.ThrowIfNull(googleClientId, nameof(options.ClientId));
                    ArgumentNullException.ThrowIfNull(googleClientSecret, nameof(options.ClientSecret));
                    options.ClientId = googleClientId;
                    options.ClientSecret = googleClientSecret;

                    options.ClaimActions.MapJsonKey(CustomClaims.Picture, "picture", "url");
                    options.SaveTokens = true;

                    options.Events.OnCreatingTicket = ctx =>
                    {
                        var tokens = ctx.Properties.GetTokens().ToList();

                        tokens.Add(
                            new AuthenticationToken
                            {
                                Name = "TicketCreated",
                                Value = DateTime.UtcNow.ToString()
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
                    // var audience = $"{config["Jwt:Audience"]}/auth-api";
                    x.TokenValidationParameters = new TokenValidationParameters
                    {
                        IssuerSigningKey = new SymmetricSecurityKey(
                            Encoding.UTF8.GetBytes(jwtSettings.Key)
                        ),
                        // IssuerSigningKey = symmetricSecurityKey,
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
}