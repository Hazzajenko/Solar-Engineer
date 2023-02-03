using Amazon.S3;
using Amazon.S3.Model;
using CloudinaryDotNet;
using dotnetapi.Features.Images.Entities;
using dotnetapi.Models.Entities;
using FastEndpoints;
using Mediator;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace dotnetapi.Features.Images.Endpoints.GetDefaultIcons;

[Authorize]
public class GetDefaultIconsEndpoint : EndpointWithoutRequest<Contracts.GetDefaultIconsResponse>
{
    private readonly string _bucketName;
    private readonly Cloudinary _cloudinary;

    private readonly ILogger<GetDefaultIconsEndpoint> _logger;
    private readonly IMediator _mediator;
    private readonly IAmazonS3 _s3Client;
    private readonly UserManager<AppUser> _userManager;

    public GetDefaultIconsEndpoint(
        ILogger<GetDefaultIconsEndpoint> logger,
        UserManager<AppUser> userManager,
        Cloudinary cloudinary,
        IAmazonS3 s3Client,
        IMediator mediator
    )
    {
        _logger = logger;
        _userManager = userManager;
        _cloudinary = cloudinary;
        _s3Client = s3Client;
        _mediator = mediator;
        _bucketName = "solarengineer";
    }

    public override void Configure()
    {
        Get("images/default-dps");
        Policies("BeAuthenticated");
    }

    public override async Task HandleAsync(CancellationToken cT)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user is null)
        {
            _logger.LogError("Bad request, User is invalid");
            ThrowError("UserName is invalid");
        }

        var bucketExists = await _s3Client.DoesS3BucketExistAsync(_bucketName);
        if (!bucketExists)
            ThrowError($"Bucket {_bucketName} does not exist.");
        var request = new ListObjectsV2Request { BucketName = _bucketName, Prefix = null };
        var result = await _s3Client.ListObjectsV2Async(request, cT);
        var s3Objects = result.S3Objects.Select(s =>
        {
            var urlRequest = new GetPreSignedUrlRequest
            {
                BucketName = _bucketName,
                Key = s.Key,
                Expires = DateTime.UtcNow.AddMinutes(1)
            };
            return new S3ImageDto { ImageName = s.Key.ToString() };
            /*return new S3ObjectDto
            {
                Name = s.Key.ToString(),
                PresignedUrl = _s3Client.GetPreSignedURL(urlRequest)
            };*/
        });
        Response.Images = s3Objects;

        await SendOkAsync(Response, cT);
    }
}