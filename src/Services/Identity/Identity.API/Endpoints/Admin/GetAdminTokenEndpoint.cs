using FastEndpoints;
using Identity.Application.Services.Jwt;

namespace Identity.API.Endpoints.Admin;

public record GetAdminTokenResponse(string Token);

public class GetAdminTokenEndpoint : EndpointWithoutRequest<GetAdminTokenResponse>
{
    private readonly IJwtTokenGenerator _tokenGenerator;

    public GetAdminTokenEndpoint(IJwtTokenGenerator tokenGenerator)
    {
        _tokenGenerator = tokenGenerator;
    }

    public override void Configure()
    {
        Get("/token");
        Summary(x =>
        {
            x.Summary = "Get admin token";
            x.Description = "Get admin token";
            x.Response<GetAdminTokenResponse>(200, "Success");
        });
        AllowAnonymous();
    }

    public override async Task HandleAsync(CancellationToken cT)
    {
        var token = _tokenGenerator.GenerateToken(
            "23424c3b-a5aa-49a1-bb70-36451b07532f",
            "Hazzajenko"
        );

        var response = new GetAdminTokenResponse(token);

        await SendOkAsync(response, cT);
    }
}