using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using dotnetapi.Features.Images.Contracts.Requests;
using dotnetapi.Models.Entities;
using FastEndpoints;
using Mediator;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace dotnetapi.Features.Images.Endpoints;

[Authorize]
public class UploadDisplayPictureEndpoint : Endpoint<UploadImageRequest, ImageUploadResult>
{
    private readonly Cloudinary _cloudinary;

    private readonly ILogger<UploadDisplayPictureEndpoint> _logger;
    private readonly IMediator _mediator;
    private readonly UserManager<AppUser> _userManager;

    public UploadDisplayPictureEndpoint(
        ILogger<UploadDisplayPictureEndpoint> logger,
        UserManager<AppUser> userManager,
        Cloudinary cloudinary,
        IMediator mediator)
    {
        _logger = logger;
        _userManager = userManager;
        _cloudinary = cloudinary;
        _mediator = mediator;
    }

    // public IHubContext<NotificationHub> HubContext { get; }

    public override void Configure()
    {
        Post("image");
        Policies("BeAuthenticated");
        AllowFileUploads();
        // Description(b => b
        // .Accepts<string>("application/json"));
        // Authenticate
    }

    public override async Task HandleAsync(UploadImageRequest request, CancellationToken cT)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user is null)
        {
            _logger.LogError("Bad request, User is invalid");
            ThrowError("UserName is invalid");
        }

        if (request.File.Length < 1)
        {
            await SendNoContentAsync(cT);
            return;
        }

        /*var result = await _cloudinary.UploadAsync(new ImageUploadParams
        {
            File = new FileDescription(request.File.FileName,
                request.File.OpenReadStream()),
            Tags = "backend_PhotoAlbum"
        }).ConfigureAwait(false);*/

        await using var stream = request.File.OpenReadStream();
        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription(request.File.FileName, stream),
            Transformation = new Transformation().Height(500).Width(500).Crop("fill")
        };
        var uploadResult = await _cloudinary.UploadAsync(uploadParams);


        _logger.LogInformation("{UserName} uploaded an image", user.UserName);

        /*await SendStreamAsync(
            stream: request.File.OpenReadStream(),
            fileName: "test.png",
            fileLengthBytes: request.File.Length,
            contentType: "image/png", cancellation: cT);*/
        await SendOkAsync(uploadResult, cT);
    }
}