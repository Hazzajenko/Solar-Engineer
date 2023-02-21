using Identity.API.Settings;
using IdentityModel.Client;
using Microsoft.Extensions.Options;

namespace Identity.API.Services;

public class TokenService : ITokenService
{
    private readonly IOptions<IdentityServerSettings> _identityServerSettings;
    private readonly ILogger<TokenService> _logger;
    private DiscoveryDocumentResponse? _discoveryDocument;

    public TokenService(ILogger<TokenService> logger, IOptions<IdentityServerSettings> identityServerSettings)
    {
        _logger = logger;
        _identityServerSettings = identityServerSettings;

        /*using var httpClient = new HttpClient();
        _discoveryDocument = httpClient.GetDiscoveryDocumentAsync(identityServerSettings.Value.DiscoveryUrl).Result;
        if (!_discoveryDocument.IsError) return;
        logger.LogError("Unable to get discovery document. Error is: {Error}", _discoveryDocument.Error);
        throw new Exception("Unable to get discovery document", _discoveryDocument.Exception);*/
    }

    public async Task<TokenResponse> GetToken(string scope)
    {
        _discoveryDocument ??= InitDiscoveryDocument();
        using var client = new HttpClient();
        var tokenResponse = await client.RequestClientCredentialsTokenAsync(new ClientCredentialsTokenRequest
        {
            Address = _discoveryDocument.TokenEndpoint,

            // ClientId = "interactive",
            ClientId = _identityServerSettings.Value.ClientName,
            ClientSecret = _identityServerSettings.Value.ClientPassword,
            Scope = scope
        });

        _logger.LogInformation("Endpoint {E}", _discoveryDocument.TokenEndpoint);

        if (tokenResponse.IsError)
        {
            _logger.LogError("Unable to get token. Error is: {TokenResponseError}", tokenResponse.Error);
            throw new Exception("Unable to get token", tokenResponse.Exception);
        }

        return tokenResponse;
    }

    private DiscoveryDocumentResponse InitDiscoveryDocument()
    {
        using var httpClient = new HttpClient();
        _discoveryDocument = httpClient.GetDiscoveryDocumentAsync(_identityServerSettings.Value.DiscoveryUrl).Result;
        if (!_discoveryDocument.IsError) return _discoveryDocument;
        _logger.LogError("Unable to get discovery document. Error is: {Error}", _discoveryDocument.Error);
        throw new Exception("Unable to get discovery document", _discoveryDocument.Exception);
    }
}