﻿using Duende.IdentityServer.Models;
using Duende.IdentityServer.Validation;
using IdentityModel;

namespace Identity.API.Deprecated.Services;

public class TokenExchangeGrantValidator : IExtensionGrantValidator
{
    private readonly ILogger<TokenExchangeGrantValidator> _logger;
    private readonly ITokenValidator _validator;

    public TokenExchangeGrantValidator(ITokenValidator validator, ILogger<TokenExchangeGrantValidator> logger)
    {
        _validator = validator;
        _logger = logger;
    }

    // register for urn:ietf:params:oauth:grant-type:token-exchange
    public string GrantType => OidcConstants.GrantTypes.TokenExchange;

    public async Task ValidateAsync(ExtensionGrantValidationContext context)
    {
        _logger.LogInformation("TokenExchangeGrantValidator");
        // default response is error
        context.Result = new GrantValidationResult(TokenRequestErrors.InvalidRequest);

        // the spec allows for various token types, most commonly you return an access token
        var customResponse = new Dictionary<string, object>
        {
            { OidcConstants.TokenResponse.IssuedTokenType, OidcConstants.TokenTypeIdentifiers.AccessToken }
        };

        // read the incoming token
        var subjectToken = context.Request.Raw.Get(OidcConstants.TokenRequest.SubjectToken);

        // and the token type
        var subjectTokenType = context.Request.Raw.Get(OidcConstants.TokenRequest.SubjectTokenType);

        // mandatory parameters
        if (string.IsNullOrWhiteSpace(subjectToken)) return;

        // for our impersonation/delegation scenario we require an access token
        if (!string.Equals(subjectTokenType, OidcConstants.TokenTypeIdentifiers.AccessToken)) return;

        // validate the incoming access token with the built-in token validator
        var validationResult = await _validator.ValidateAccessTokenAsync(subjectToken);
        if (validationResult.IsError) return;

        // these are two values you typically care about
        var sub = validationResult.Claims.First(c => c.Type == JwtClaimTypes.Subject).Value;
        var clientId = validationResult.Claims.First(c => c.Type == JwtClaimTypes.ClientId).Value;

        // add any custom logic here (if needed)

        // create response
        // create impersonation response
        context.Result = new GrantValidationResult(
            sub,
            GrantType,
            customResponse: customResponse);
    }
}