﻿using System.Text;
using Infrastructure.Authentication;
using Microsoft.AspNetCore.Authentication;
using Microsoft.IdentityModel.Tokens;

namespace Identity.API.Extensions;

public static class AuthenticationExtensions
{
    public static IServiceCollection InitAuthentication(
        this IServiceCollection services,
        IConfiguration config
    )
    {
        services
            .AddAuthentication()
            // .AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
            /*.AddCookie(CookieAuthenticationDefaults.AuthenticationScheme, options =>
            {
                options.LoginPath = "/auth/login";

                options.Cookie.HttpOnly = true;
                options.Cookie.SecurePolicy = CookieSecurePolicy.Always;

                /*options.Events = new CookieAuthenticationEvents
                {
                    OnValidatePrincipal = CookieHelpers.ValidateAsync
                };#1#
            })*/
            // .AddCookie("cookie", options => { options.Events.OnValidatePrincipal = PrincipalValidator.ValidateAsync; })
            // .AddGoogle( options =>
            .AddGoogle(
                "google",
                options =>
                {
                    // options.SignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;

                    options.ClientId =
                        config["Google:ClientId"]
                        ?? throw new ArgumentNullException(nameof(options.ClientId));
                    options.ClientSecret =
                        config["Google:ClientSecret"]
                        ?? throw new ArgumentNullException(nameof(options.ClientSecret));

                    // options.ClaimActions.MapJsonKey("urn:google:picture", "picture", "url");
                    // options.ClaimActions.MapJsonKey("iss", "iss", "string");

                    options.ClaimActions.MapJsonKey(CustomClaims.Picture, "picture", "url");
                    // options.ClaimActions.MapJsonKey("urn:google:locale", "locale", "string");
                    // options.ClaimActions.
                    // options.ClaimActions.Add(new );
                    // options.ClaimActions.

                    options.SaveTokens = true;

                    /*options.Events.OnCreatingTicket = async ctx =>
                    {
                        using var request = new HttpRequestMessage(HttpMethod.Get, ctx.Options.UserInformationEndpoint);
                        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", ctx.AccessToken);
                        using var result = await ctx.Backchannel.SendAsync(request);
                        var user = await result.Content.ReadFromJsonAsync<JsonElement>();
                        ctx.RunClaimActions(user);
                    };*/

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

                    /*
                    options.Events.OnRedirectToAuthorizationEndpoint = context =>
                    {
                        context.Response.Cookies.Append("provider", "google");
                        return Task.CompletedTask;
                    };*/
                }
            )
            .AddJwtBearer(
                "bearer",
                x =>
                {
                    var audience = $"{config["Jwt:Audience"]}/auth-api";
                    x.TokenValidationParameters = new TokenValidationParameters
                    {
                        IssuerSigningKey = new SymmetricSecurityKey(
                            Encoding.UTF8.GetBytes(config["Jwt:Key"]!)
                        ),
                        ValidateIssuerSigningKey = true,
                        ValidateLifetime = true,
                        ValidIssuer = config["Jwt:Issuer"],
                        ValidAudience = config["Jwt:Audience"],
                        ValidateIssuer = true,
                        ValidateAudience = true
                    };
                }
            );
        ;

        return services;
    }
}