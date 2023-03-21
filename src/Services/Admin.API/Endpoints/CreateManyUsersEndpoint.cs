using FastEndpoints;

namespace Admin.API.Endpoints;

public class CreateManyUsersEndpoint : EndpointWithoutRequest
{
    public override void Configure()
    {
        Post("/admin/users/create-many");
        AllowAnonymous();
    }

    public override async Task HandleAsync(CancellationToken cT)
    {
        await SendOkAsync(cT);
    }
}