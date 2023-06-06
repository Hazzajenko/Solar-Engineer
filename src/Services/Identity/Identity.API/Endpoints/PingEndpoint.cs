using FastEndpoints;

namespace Identity.API.Endpoints;

public class PingResponse
{
    public string Ping { get; set; } = null!;
}

public class PingEndpoint : EndpointWithoutRequest<PingResponse>
{
    public override void Configure()
    {
        Get("/ping");
        AllowAnonymous();
    }

    public override async Task HandleAsync(CancellationToken cT)
    {
        Response.Ping = "Pong";
        await SendOkAsync(Response, cT);
    }
}
