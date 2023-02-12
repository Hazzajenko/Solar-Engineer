using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure.Authentication;

public static class AuthConfig
{
    public static IServiceCollection AddAuth(
        this IServiceCollection services,
        IConfiguration config
    )
    {
        services
            .AddAuthentication("cookie")
            .AddCookie("cookie", options => { options.LoginPath = "/google2"; })
            // .AddCookie("cookie", options => { options.Events.OnValidatePrincipal = PrincipalValidator.ValidateAsync; })
            .AddGoogle("google", options =>
            {
                options.SignInScheme = "cookie";

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
                };*/
            })
            .AddOAuth("github", options =>
            {
                options.SignInScheme = "cookie";

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
            });


        return services;
    }
}