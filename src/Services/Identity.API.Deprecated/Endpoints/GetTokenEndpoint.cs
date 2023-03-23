using FastEndpoints;
using Identity.API.Deprecated.Models;
using Identity.API.Deprecated.Services;
using Mediator;

namespace Identity.API.Deprecated.Endpoints;

public class GetTokenEndpoint : EndpointWithoutRequest<AppUserToken>
{
    private readonly IMediator _mediator;
    private readonly ITokenService _tokenService;

    public GetTokenEndpoint(
        IMediator mediator, ITokenService tokenService)
    {
        _mediator = mediator;
        _tokenService = tokenService;
    }

    public override void Configure()
    {
        Get("/token");
        // Policies("ApiScope");
    }

    public override async Task HandleAsync(CancellationToken cT)
    {
        // using var client = new HttpClient();
        var tokenResponse = await _tokenService.GetToken("users-api");
        /*var disco = await client.GetDiscoveryDocumentAsync("https://localhost:6006", cT);
        if (disco.IsError)
        {
            Console.WriteLine(disco.Error);
            return;
        }

        var tokenResponse = await client.RequestClientCredentialsTokenAsync(new ClientCredentialsTokenRequest
        {
            Address = disco.TokenEndpoint,

            ClientId = "m2m.client",
            // ClientId = "client",
            ClientSecret = "secret",
            Scope = StandardScopes.UsersApi
            // Scope = "api1"
        }, cT);

        if (tokenResponse.IsError)
        {
            Console.WriteLine(tokenResponse.Error);
            Console.WriteLine(tokenResponse.ErrorDescription);
            return;
        }*/

        Response = new AppUserToken
        {
            AccessToken = tokenResponse.AccessToken,
            ExpiresIn = tokenResponse.ExpiresIn
        };
        // Console.WriteLine(tokenResponse.AccessToken);

        await SendOkAsync(Response, cT);
/*
// call api
        var apiClient = new HttpClient();
        apiClient.SetBearerToken(tokenResponse.AccessToken);

        var response = await apiClient.GetAsync("https://localhost:6006/identity", cT);
        if (!response.IsSuccessStatusCode)
        {
            Console.WriteLine(response.StatusCode);
        }
   
            var content = await response.Content.ReadAsStringAsync(cT);

            var parsed = JsonDocument.Parse(content);
            var formatted = JsonSerializer.Serialize(parsed, new JsonSerializerOptions { WriteIndented = true });

            Console.WriteLine(formatted);*/


        /*await HttpContext.GetTokenAsync("access_token");
        var res = HttpContext.User.Claims.Select(x => new { x.Type, x.Value }).ToList();*/
        // await SendOkAsync(res, cT);
    }
}