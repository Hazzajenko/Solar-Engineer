using FastEndpoints;
using IdentityModel.Client;
using Infrastructure.Authentication;
using Mediator;

namespace Users.API.Endpoints;

public class GetTokenEndpoint : EndpointWithoutRequest
{
    private readonly IMediator _mediator;

    public GetTokenEndpoint(
        IMediator mediator
    )
    {
        _mediator = mediator;
    }

    public override void Configure()
    {
        Get("/token");
        // Policies("ApiScope");
    }

    public override async Task HandleAsync(CancellationToken cT)
    {
        var client = new HttpClient();
        var disco = await client.GetDiscoveryDocumentAsync("https://localhost:6006", cT);
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
        }

        var tk = new TokenResponse();
        Console.WriteLine(tokenResponse.AccessToken);

        await SendOkAsync(tokenResponse, cT);
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