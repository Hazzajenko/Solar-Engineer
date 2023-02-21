using System.Security.Claims;
using Duende.IdentityServer.Validation;
using Infrastructure.Authentication;

namespace Identity.API.Services;

public class TransactionScopeTokenRequestValidator : ICustomTokenRequestValidator
{
    private readonly ILogger<TransactionScopeTokenRequestValidator> _logger;

    public TransactionScopeTokenRequestValidator(ILogger<TransactionScopeTokenRequestValidator> logger)
    {
        _logger = logger;
    }

    public Task ValidateAsync(CustomTokenRequestValidationContext context)
    {
        _logger.LogInformation("TransactionScopeTokenRequestValidator:ValidateAsync");
        var user = context.Result.ValidatedRequest;

        // context.Result.ValidatedRequest.
        /*context.Result.ValidatedRequest.ClientClaims.Add(
            new Claim(transaction.ParsedName, transaction.ParsedParameter));*/
        var scopeValue = context
            .Result
            .ValidatedRequest
            .ValidatedResources
            .ParsedScopes.FirstOrDefault(x => x.ParsedName == Constants.StandardScopes.UsersApi);

        if (scopeValue?.ParsedParameter != null)
            // emit transaction id as a claim
            context.Result.ValidatedRequest.ClientClaims.Add(
                new Claim(scopeValue.ParsedName, scopeValue.ParsedParameter));
        // also shorten token lifetime
        // context.Result.ValidatedRequest.AccessTokenLifetime = 10;
        /*var transaction = context
            .Result
            .ValidatedRequest
            .ValidatedResources
            .ParsedScopes.FirstOrDefault(x => x.ParsedName == "transaction");*/
        /*context.Result.ValidatedRequest.ClientClaims.Add(
            new Claim(JwtClaimTypes.Id, ""));*/

        /*JwtClaimTypes.Subject,
        JwtClaimTypes.Id,*/
        // transaction scope has been requested
        /*
        if (transaction?.ParsedParameter != null)
        {
            // emit transaction id as a claim
            context.Result.ValidatedRequest.ClientClaims.Add(
                new Claim(transaction.ParsedName, transaction.ParsedParameter));

            // also shorten token lifetime
            // context.Result.ValidatedRequest.AccessTokenLifetime = 10;
        }
        */

        return Task.CompletedTask;
    }
}