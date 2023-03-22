using Auth.API.Services.Images;
using FastEndpoints;

namespace Auth.API.Endpoints.Admin;

public class DownloadImageByUrlRequest
{
    public string ImageUrl { get; set; } = default!;
}

public class DownloadImageByUrlResponse
{
    public string ImageUrl { get; set; } = default!;
}

public class DownloadImageByUrlEndpoint
    : Endpoint<DownloadImageByUrlRequest, DownloadImageByUrlResponse>
{
    private readonly IImagesService _imagesService;

    public DownloadImageByUrlEndpoint(IImagesService imagesService)
    {
        _imagesService = imagesService;
    }

    public override void Configure()
    {
        Post("/admin/images/download");
        AllowAnonymous();
    }

    public override async Task HandleAsync(DownloadImageByUrlRequest request, CancellationToken cT)
    {
        var imageUrl = await _imagesService.DownloadImageAsync(request.ImageUrl);

        Response.ImageUrl = imageUrl;

        await SendOkAsync(Response, cT);
    }
}