using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Authentication;

namespace Auth.API.Extensions.ServiceCollection;

public static class Authentication
{
    public static IServiceCollection AddOAuth(
        this IServiceCollection services,
        IConfiguration config
    )
    {
        services
            /*.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = IdentityConstants.ApplicationScheme;
                options.DefaultChallengeScheme = IdentityConstants.ApplicationScheme;
                options.DefaultSignInScheme = IdentityConstants.ExternalScheme;
                // options.E
            }) /*.Add#1#*/
            .AddAuthentication("cookie")
            /*.AddAuthentication(options =>
            {
                options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                options.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                options.DefaultForbidScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                options.DefaultSignOutScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                // options.DefaultChallengeScheme = "oidc";
                options.DefaultChallengeScheme = CookieAuthenticationDefaults.AuthenticationScheme;
            }).AddCookie(CookieAuthenticationDefaults.AuthenticationScheme,
                options =>
                {
                    options.Cookie.SameSite = SameSiteMode.None;
                    options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
                    options.Cookie.IsEssential = true;
                })*/
            .AddCookie("cookie", options => { options.LoginPath = "/google2"; })
            // .AddCookie("cookie", options => { options.Events.OnValidatePrincipal = PrincipalValidator.ValidateAsync; })
            .AddGoogle("google", options =>
            {
                // options.SignInScheme = IdentityConstants.ExternalScheme;
                options.SignInScheme = "cookie";
                // options.SignInScheme = "Identity.External";
                options.ClientId = config["Google:ClientId"] ??
                                   throw new ArgumentNullException(nameof(options.ClientId));
                options.ClientSecret = config["Google:ClientSecret"] ??
                                       throw new ArgumentNullException(nameof(options.ClientSecret));

                options.ClaimActions.MapJsonKey("urn:google:picture", "picture", "url");
                options.ClaimActions.MapJsonKey(ClaimTypesExtensions.Picture, "picture", "url");
                // options.ClaimActions.MapJsonKey(ClaimTypes., "picture", "url");
                options.ClaimActions.MapJsonKey("urn:google:locale", "locale", "string");

                options.SaveTokens = true;
                // save oauth token to cookie
                /*options.Events = new OAuthEvents
                {
                    OnCreatingTicket = async context =>
                    {
                        var request = new HttpRequestMessage(HttpMethod.Get, context.Options.UserInformationEndpoint);
                        request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", context.AccessToken);
                        var response = await context.Backchannel.SendAsync(request,
                            HttpCompletionOption.ResponseHeadersRead, context.HttpContext.RequestAborted);
                        response.EnsureSuccessStatusCode();
                        var json = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
                        context.RunClaimActions(json.RootElement);
                    }
                };*/
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

                    tokens.Add(new AuthenticationToken
                    {
                        Name = "TicketCreated",
                        Value = DateTime.UtcNow.ToString()
                    });
                    ctx.Properties.StoreTokens(tokens);

                    return Task.CompletedTask;
                };
            })
            .AddOAuth("github", options =>
            {
                // options.SignInScheme = "Identity.External";
                // options.SignInScheme = "cookie";

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