using Identity.Application.Commands;
using Identity.Application.Extensions;
using Identity.Application.Services.AzureStorage;
using Identity.Contracts.Data;
using Identity.Domain;
using Mediator;
using Microsoft.Extensions.Logging;
using SkiaSharp;

namespace Identity.Application.Handlers.Images;

public class UploadUrlImageToCdnHandler
    : ICommandHandler<UploadUrlImageToCdnCommand, UploadUrlImageToCdnResponse>
{
    private readonly ILogger<UploadUrlImageToCdnHandler> _logger;
    private readonly IAzureStorage _azureStorage;

    public UploadUrlImageToCdnHandler(
        ILogger<UploadUrlImageToCdnHandler> logger,
        IAzureStorage azureStorage
    )
    {
        _logger = logger;
        _azureStorage = azureStorage;
    }

    public async ValueTask<UploadUrlImageToCdnResponse> Handle(
        UploadUrlImageToCdnCommand command,
        CancellationToken cT
    )
    {
        AppUser appUser = command.AppUser;
        using var httpClient = new HttpClient();
        var imageBytes = await httpClient.GetByteArrayAsync(appUser.PhotoUrl, cT);
        BlobResponseDto result = await _azureStorage.UploadImageToBlobStorage(
            imageBytes,
            appUser.Id.ToString()
        );

        if (result is null)
        {
            _logger.LogError(
                "{User} failed to upload image to blob storage",
                appUser.GetLoggingString()
            );
            throw new Exception("Error uploading image to blob storage");
        }

        var photoUrl = result.Blob.Uri;
        if (photoUrl is null)
        {
            _logger.LogError(
                "{User} failed to upload image to blob storage",
                appUser.GetLoggingString()
            );

            throw new Exception("Error uploading image to blob storage");
        }
        _logger.LogInformation(
            "{User} uploaded image to blob storage: {Uri}",
            appUser.GetLoggingString(),
            photoUrl
        );

        return new UploadUrlImageToCdnResponse { PhotoUrl = photoUrl };
    }
}
