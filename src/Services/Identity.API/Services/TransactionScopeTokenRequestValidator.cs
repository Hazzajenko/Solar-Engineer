using System.Security.Claims;
using Duende.IdentityServer.Validation;

namespace Identity.API.Services;

public class TransactionScopeTokenRequestValidator : ICustomTokenRequestValidator
{
    public Task ValidateAsync(CustomTokenRequestValidationContext context)
    {
        var user = context.Result.ValidatedRequest;

        // context.Result.ValidatedRequest.
        /*context.Result.ValidatedRequest.ClientClaims.Add(
            new Claim(transaction.ParsedName, transaction.ParsedParameter));*/

        var transaction = context
            .Result
            .ValidatedRequest
            .ValidatedResources
            .ParsedScopes.FirstOrDefault(x => x.ParsedName == "transaction");

        // transaction scope has been requested
        if (transaction?.ParsedParameter != null)
        {
            // emit transaction id as a claim
            context.Result.ValidatedRequest.ClientClaims.Add(
                new Claim(transaction.ParsedName, transaction.ParsedParameter));

            // also shorten token lifetime
            context.Result.ValidatedRequest.AccessTokenLifetime = 10;
        }

        return Task.CompletedTask;
    }
}