using FastEndpoints;
using Mediator;
using Users.API.Contracts.Requests.Images;
using Users.API.Contracts.Responses.Images;
using Users.API.Handlers.Images.CreateDpImage;

namespace Users.API.Endpoints;

public class CreateImageDpEndpoint : Endpoint<CreateDpImageRequest, CreateDpImageResponse>
{
    private readonly IMediator _mediator;

    public CreateImageDpEndpoint(IMediator mediator)
    {
        _mediator = mediator;
    }

    public override void Configure()
    {
        Post("/dp-image");
        AllowAnonymous();
    }

    public override async Task HandleAsync(CreateDpImageRequest request, CancellationToken cT)
    {
        Response = await _mediator.Send(new CreateDpImageCommand(request.Initials), cT);
        await SendOkAsync(Response, cT);
    }
}