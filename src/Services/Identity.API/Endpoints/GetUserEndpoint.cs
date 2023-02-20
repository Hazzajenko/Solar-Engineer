using FastEndpoints;
using Identity.API.Services;
using Mediator;
using Microsoft.AspNetCore.Authentication;

namespace Identity.API.Endpoints;

public class GetUserEndpoint : EndpointWithoutRequest
{
    private readonly IMediator _mediator;
    private readonly ITokenService _tokenService;

    public GetUserEndpoint(
        IMediator mediator, ITokenService tokenService)
    {
        _mediator = mediator;
        _tokenService = tokenService;
    }

    public override void Configure()
    {
        Get("/user");
        // Policies("ApiScope");
    }

    public override async Task HandleAsync(CancellationToken cT)
    {
        await HttpContext.GetTokenAsync("access_token");
        Response = HttpContext.User.Claims.Select(x => new { x.Type, x.Value }).ToList();

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