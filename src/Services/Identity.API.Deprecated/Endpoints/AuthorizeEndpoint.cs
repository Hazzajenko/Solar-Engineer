using System.Security.Claims;
using Duende.IdentityServer;
using Duende.IdentityServer.Events;
using Duende.IdentityServer.Services;
using Duende.IdentityServer.Validation;
using FastEndpoints;
using Identity.API.Deprecated.Entities;
using Identity.API.Deprecated.Exceptions;
using Identity.API.Deprecated.Mapping;
using IdentityModel;
using Mediator;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using ITokenService = Identity.API.Deprecated.Services.ITokenService;

namespace Identity.API.Deprecated.Endpoints;
// using Auth.API.RabbitMQ;

// using MassTransit.Mediator;

public class AuthorizeEndpoint : EndpointWithoutRequest
{
    private const string TokenPrefix = ".Token.";
    private const string TokenNamesKey = ".TokenNames";
    private readonly IEventService _events;
    private readonly IExtensionGrantValidator _grantValidator;

    private readonly IIdentityServerInteractionService _interaction;
    private readonly IMediator _mediator;
    private readonly SignInManager<AppUser> _signInManager;
    private readonly ITokenService _tokenService;

    // private readonly IAuthService _authService;
    // private readonly IBus _bus;
    private readonly IdentityServerTools _tools;

    // private readonly IUserAccessTokenStore _userAccessTokenStore;
    private readonly UserManager<AppUser> _usersManager;


    public AuthorizeEndpoint(
        IdentityServerTools tools,
        IMediator mediator, UserManager<AppUser> usersManager, IIdentityServerInteractionService interaction,
        IEventService events, SignInManager<AppUser> signInManager,
        ITokenService tokenService, IExtensionGrantValidator grantValidator)
    {
        _tools = tools;
        _mediator = mediator;
        _usersManager = usersManager;
        _interaction = interaction;
        _events = events;
        // _userAccessTokenStore = userAccessTokenStore;
        _signInManager = signInManager;
        _tokenService = tokenService;
        _grantValidator = grantValidator;
        // _authService = authService;
        // _bus = bus;
        // _publisherService = publisherService;
    }


    public override void Configure()
    {
        Get("/authorize");
        // AuthSchemes(JwtBearerDefaults.AuthenticationScheme);
        // AllowAnonymous();
        AuthSchemes("google");
        // PreProcessors(new SecurityHeadersProcessor());
        // AuthSchemes(IdentityServerConstants.ExternalCookieAuthenticationScheme);
    }

    public override async Task HandleAsync(CancellationToken cT)
    {
        // var token = await /*User.GetT();*/
        // var token = await HttpContext.GetUserAccessTokenAsync();
        // var accessToken = await HttpContext.GetTokenAsync("access_token");
        // var idToken = await HttpContext.GetTokenAsync("id_token");
        // var refreshToken = await HttpContext.GetTokenAsync("refresh_token");

        // var claims2 = User.Claims.ToList();

        // var _accessToken = new JwtSecurityTokenHandler().ReadJwtToken(accessToken);
        // var _idToken = new JwtSecurityTokenHandler().ReadJwtToken(idToken);

        // var result2 = await GetSecret(accessToken);


        var result = await HttpContext.AuthenticateAsync(IdentityServerConstants.ExternalCookieAuthenticationScheme);
        if (result?.Succeeded != true) throw new Exception("External authentication error");

        var externalUser = result.Principal /* ?? throw new ArgumentNullException(nameof(result.Principal))*/;
        ArgumentNullException.ThrowIfNull(externalUser);

        if (Logger.IsEnabled(LogLevel.Debug))
        {
            var externalClaims = externalUser.Claims.Select(c => $"{c.Type}: {c.Value}");
            Logger.LogInformation("External claims: {@Claims}", externalClaims);
        }

        // lookup our user and external provider info
        // try to determine the unique id of the external user (issued by the provider)
        // the most common claim type for that are the sub claim and the NameIdentifier
        // depending on the external provider, some other claim type might be used
        var userIdClaim = externalUser.FindFirst(JwtClaimTypes.Subject) ??
                          externalUser.FindFirst(ClaimTypes.NameIdentifier) ??
                          throw new Exception("Unknown userid");

        var props = result.Properties;
        var provider = result.Properties?.Items.FirstOrDefault(x => x.Key == ".AuthScheme").Value; /* ??
                       throw new ArgumentNullException(nameof(result.Properties.Items));*/
        ArgumentNullException.ThrowIfNull(provider);
        var providerUserId = userIdClaim.Value;

        // await _usersManager.Get
        // await _usersManager.GetClaimsAsync(a)
        var user = await _usersManager.FindByLoginAsync(provider, providerUserId);
        if (user == null)
        {
            // this might be where you might initiate a custom workflow for user registration
            // in this sample we don't show how that would be done, as our sample implementation
            // simply auto-provisions new external user
            //
            // remove the user id claim so we don't include it as an extra claim if/when we provision the user
            var claims = externalUser.Claims.ToList();
            claims.Remove(userIdClaim);
            var appUser = externalUser.ToAppUser();

            var createUser = await _usersManager.CreateAsync(appUser);

            if (!createUser.Succeeded)
            {
                Logger.LogError("Unable to create user {@User}, {@Errors}", user, createUser.Errors);
                throw new UnauthorizedException();
            }

            var identityResult = await _usersManager.AddLoginAsync(
                appUser,
                new UserLoginInfo(
                    provider,
                    providerUserId,
                    appUser.Email
                )
            );

            if (!identityResult.Succeeded)
            {
                Logger.LogError(
                    "Unable to add login provider to AppUser {User}, {@Errors}",
                    appUser.Id,
                    identityResult.Errors
                );
                throw new UnauthorizedException();
            }

            var claimsResult = await _usersManager.AddClaimsAsync(appUser, claims);
            user = appUser;
            // claims.

            // user = _usersManager.CreateAsync(provider, providerUserId, claims.ToList());
        }

        // this allows us to collect any additional claims or properties
        // for the specific protocols used and store them in the local auth cookie.
        // this is typically used to store data needed for signout from those protocols.
        var additionalLocalClaims = new List<Claim>();
        var localSignInProps = new AuthenticationProperties
        {
            RedirectUri = "https://localhost:4200"
        };
        // CaptureExternalLoginContext(result, additionalLocalClaims, localSignInProps);

        // issue authentication cookie for user
        var isUser = new IdentityServerUser(user.Id.ToString())
        {
            DisplayName = user.DisplayName,
            IdentityProvider = provider,
            AdditionalClaims = additionalLocalClaims
        };
// result.
        /*var token = result.Properties?.Items.Where(x => x.Key.StartsWith(TokenPrefix)).ToList();
        foreach (var (key, value) in token)
        {
            Logger.LogInformation("{K}, {V}", key, value);
        }*/

        /*var token = result.GetUserAccessToken() ??
                    throw new ArgumentNullException(nameof(UserAccessToken));*/
        // await _userAccessTokenStore.StoreTokenAsync(User, token.AccessToken!, (DateTimeOffset)token.Expiration!);
        /*var addTokensResult = await _signInManager.UpdateExternalAuthenticationTokensAsync(new ExternalLoginInfo(User,
            provider,
            providerUserId, user.DisplayName));
        if (addTokensResult.Errors.Any())
            foreach (var identityError in addTokensResult.Errors)
                Logger.LogError("Error: {E} {B}", identityError.Code, identityError.Description);*/
        // var token = await _userAccessTokenStore.GetTokenAsync(externalUser);

        // var token2 = await _usersManager.Generate(user, provider, providerUserId);
        // var token2 = await _usersManager.GenerateUserTokenAsync(user, provider, providerUserId);
        // var token = await _usersManager.GetAuthenticationTokenAsync(user, provider, providerUserId);
        // Logger.LogInformation("Token {Token}", token2);
        // Logger.LogInformation("Token {@Token}", token);

        await HttpContext.SignInAsync(isUser, localSignInProps);

        // delete temporary cookie used during external authentication
        await HttpContext.SignOutAsync(IdentityServerConstants.ExternalCookieAuthenticationScheme);

        // retrieve return URL

        var returnUrl = result.Properties?.Items.FirstOrDefault(x => x.Key == "returnUrl").Value ?? "";

        // check if external login is in the context of an OIDC request
        var context = await _interaction.GetAuthorizationContextAsync(returnUrl);
        await _events.RaiseAsync(new UserLoginSuccessEvent(provider, providerUserId, user.Id.ToString(),
            user.DisplayName, true, context?.Client.ClientId));

        /*if (context != null)
        {
            if (context.Client.IsNativeClient())
            {
                // The client is native, so this change in how to
                // return the response is for better UX for the end user.
                return this.LoadingPage(returnUrl);
            }
        }*/

        Logger.LogInformation("ReturnUrl {ReturnUrl}", returnUrl);
        // "/bff/login?returnUrl=/logged-in";
        // var returnUrlResult = "?returnUrl=/logged-in";
        /*var emailAddress = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress";
        var surname = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname";
        var name = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name";
        var scopes = $"users-api {emailAddress} {surname} {name}";
        Console.WriteLine($"{HttpContext.Request.Scheme}://{HttpContext.Request.Host}{HttpContext.Request.PathBase}");*/
        var tokenResponse = await _tokenService.GetToken("users-api");
        // _grantValidator.ValidateAsync()
        // var tokenResponse = await _tokenService.GetToken("openid users-api");

        /*var token2 = await _tools.IssueClientJwtAsync(
            "m2m.client",
            3600,
            // scopes: "users-api",
            new[] { "scope", "profile", "users-api" },
            new[] { "https://localhost:6006" },
            externalUser.Claims
        );
        var nexty = new AppUserToken
        {
            AccessToken = token2
        };*/

        /*var client = new HttpClient();
        var metaDataResponse = await client.GetDiscoveryDocumentAsync("https://localhost:6006", cancellationToken: cT);
        var response = await client.GetUserInfoAsync(new UserInfoRequest
        {
            Address = metaDataResponse.UserInfoEndpoint,
            Token = token2
        }, cancellationToken: cT);
        if(response.IsError)
        {
            Logger.LogError("Problem while fetching data from the UserInfo endpoint {E}", response.Exception);
            // throw new Exception("Problem while fetching data from the UserInfo endpoint", response.Exception);
        }*/
        /*Response = new()
        {
           string AccessToken = token2;
            
        }*/
        // await SendRedirectAsync(returnUrlResult, cancellation: cT);
        await SendOkAsync(tokenResponse, cT);
        // await SendRedirectAsync("/success", cancellation: cT);
        // return Redirect(returnUrl);
        /*var id = User.FindFirstValue(IdentityServerConstants.ClaimTypes.Tenant)!;
        Logger.LogInformation("User {User}", id);*/
        // var appUser = await _mediator.Send(new AuthorizeCommand(HttpContext), cT);
//         var token = await _authService.Generate(appUser, HttpContext.User.GetLogin());/*
//
//         var request = appUser.ToEvent().LoggedIn();
//         await _publisherService.PublishAsync(request);*/

        /*Uri uri1 = new Uri("rabbitmq://localhost/appUserLoggedIn-Users");
            Uri uri2 = new Uri("rabbitmq://localhost/appUserLoggedIn-Messages");
            var endPoint1 = await _bus.GetSendEndpoint(uri1);
            var endPoint2 = await _bus.GetSendEndpoint(uri2);
            await endPoint1.Send(appUser.ToEvent().LoggedIn(), cT);
            await endPoint2.Send(appUser.ToEvent().LoggedIn(), cT);*/

        // Response.Token = "token.Token";

        // await SendOkAsync(cT);
    }

    // if the external login is OIDC-based, there are certain things we need to preserve to make logout work
    // this will be different for WS-Fed, SAML2p or other protocols
    /*private void CaptureExternalLoginContext(AuthenticateResult externalResult, List<Claim> localClaims,
        AuthenticationProperties localSignInProps)
    {
        // if the external system sent a session id claim, copy it over
        // so we can use it for single sign-out
        var sid = externalResult.Principal.Claims.FirstOrDefault(x => x.Type == JwtClaimTypes.SessionId);
        if (sid != null) localClaims.Add(new Claim(JwtClaimTypes.SessionId, sid.Value));

        // if the external provider issued an id_token, we'll keep it for signout
        var idToken = externalResult.Properties.GetTokenValue("id_token");
        if (idToken != null)
            localSignInProps.StoreTokens(new[] { new AuthenticationToken { Name = "id_token", Value = idToken } });
    }*/

    /*public async Task<string> GetSecret(string accessToken)
    {
        var apiClient = _httpClientFactory.CreateClient();
        apiClient.SetBearerToken(accessToken);
        var response = await apiClient.GetAsync("https://localhost:7002/api/secret");
        var content = await response.Content.ReadAsStringAsync();
        return content;
    }*/
}