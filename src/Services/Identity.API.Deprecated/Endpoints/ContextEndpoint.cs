using Duende.IdentityServer.Services;
using FastEndpoints;

namespace Identity.API.Deprecated.Endpoints;
// using Auth.API.RabbitMQ;

// using MassTransit.Mediator;

public class ContextEndpoint : EndpointWithoutRequest
{
    private readonly IIdentityServerInteractionService _interaction;


    public ContextEndpoint(
        IIdentityServerInteractionService interaction)
    {
        _interaction = interaction;
    }


    public override void Configure()
    {
        Get("/context");
    }

    public override async Task HandleAsync(CancellationToken cT)
    {
        var returnUrl = "https://localhost:4200";
        var authzContext = await _interaction.GetAuthorizationContextAsync(returnUrl);
        if (authzContext is null)
        {
            ThrowError("authzContext is null");
            return;
        }

        await SendOkAsync(new
        {
            loginHint = authzContext.LoginHint,
            idp = authzContext.IdP,
            tenant = authzContext.Tenant,
            scopes = authzContext.ValidatedResources.RawScopeValues,
            client = authzContext.Client.ClientName ?? authzContext.Client.ClientId
        }, cT);
    }
}