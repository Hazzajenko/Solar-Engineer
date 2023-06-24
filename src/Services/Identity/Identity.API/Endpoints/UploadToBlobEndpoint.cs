using FastEndpoints;
using Identity.Application.Services.AzureStorage;
using Identity.Application.Services.Images;
using Identity.Contracts.Data;
using Mediator;

namespace Identity.API.Endpoints;

public class UploadToBlobEndpoint : EndpointWithoutRequest<BlobResponseDto>
{
    private readonly IAzureStorage _azureStorage;
    private readonly IImagesService _imagesService;
    private readonly IMediator _mediator;

    public UploadToBlobEndpoint(
        IAzureStorage azureStorage,
        IMediator mediator,
        IImagesService imagesService
    )
    {
        _azureStorage = azureStorage;
        _mediator = mediator;
        _imagesService = imagesService;
    }

    public override void Configure()
    {
        Get("/blob");
        AllowAnonymous();
    }

    public override async Task HandleAsync(CancellationToken cT)
    {
        // var image = await _mediator.Send(new CreateDpImageCommand("HJ"), cT);
        var bytes = _imagesService.CreateDpImageFromInitialsToByteArray("HJ");
        Response = await _azureStorage.UploadImageToBlobStorage(bytes, "test.png");
        await SendOkAsync(Response, cT);
        // await _azureStorage.UploadImageToBlobStorage(image.ImageUrl, "test.png");
        // await SendOkAsync("Ok", cT);
    }
}
