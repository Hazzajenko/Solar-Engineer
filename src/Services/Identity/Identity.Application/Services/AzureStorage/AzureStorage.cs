using Azure;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Identity.Application.Settings;
using Identity.Contracts.Data;
using Infrastructure.Logging;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Identity.Application.Services.AzureStorage;

public class AzureStorage : IAzureStorage
{
    private readonly ILogger<AzureStorage> _logger;
    private readonly StorageSettings _storageSettings;
    private readonly IHttpClientFactory _httpClientFactory;

    public AzureStorage(
        ILogger<AzureStorage> logger,
        IOptions<StorageSettings> storageSettings,
        IHttpClientFactory httpClientFactory
    )
    {
        _logger = logger;
        _httpClientFactory = httpClientFactory;
        _storageSettings = storageSettings.Value;
    }

    public async Task<BlobResponseDto> UploadImageToBlobStorage(byte[] imageBytes, string blobName)
    {
        BlobResponseDto response = new();

        var container = new BlobContainerClient(
            _storageSettings.ConnectionString,
            _storageSettings.ContainerName
        );

        await container.CreateIfNotExistsAsync();

        var pngFileName = blobName.Contains(".png") ? blobName : $"{blobName}.png";

        BlobClient blob = container.GetBlobClient(pngFileName);

        await using (Stream stream = new MemoryStream(imageBytes))
        {
            await blob.UploadAsync(stream, overwrite: true);
        }
        await blob.SetHttpHeadersAsync(new BlobHttpHeaders { ContentType = "image/png" });
        _logger.LogInformation("File {BlobName} Uploaded Successfully", pngFileName);
        response.Status = $"File {pngFileName} Uploaded Successfully";
        response.Error = false;
        response.Blob.Uri = blob.Uri.AbsoluteUri;
        response.Blob.Name = blob.Name;
        return response;
    }

    public async Task<string> UploadImageAsync(IFormFile image)
    {
        var blobServiceClient = new BlobServiceClient(_storageSettings.ConnectionString);
        var containerClient = blobServiceClient.GetBlobContainerClient("images");

        var extension = Path.GetExtension(image.FileName);
        var blobName = Guid.NewGuid() + extension;

        var contentType = GetContentTypeFromImageUrl(image.FileName);

        BlobClient? blobClient = containerClient.GetBlobClient(blobName);

        await using (Stream stream = image.OpenReadStream())
        {
            await blobClient.UploadAsync(
                stream,
                new BlobHttpHeaders { ContentType = contentType },
                conditions: null
            );
        }

        return blobClient.Uri.AbsoluteUri;
    }

    public async Task<string> DownloadImageAsync(string imageUrl)
    {
        var blobServiceClient = new BlobServiceClient(_storageSettings.ConnectionString);
        var containerClient = blobServiceClient.GetBlobContainerClient("images");

        var extension = ".png";
        var blobName = Guid.NewGuid() + extension;

        var client = _httpClientFactory.CreateClient("Images");
        var imageData = await client.GetByteArrayAsync(imageUrl);
        var contentType = "image/png";

        var blobClient = containerClient.GetBlobClient(blobName);

        using (var stream = new MemoryStream(imageData))
        {
            await blobClient.UploadAsync(
                stream,
                new BlobHttpHeaders { ContentType = contentType },
                conditions: null
            );
        }

        return blobClient.Uri.AbsoluteUri;
    }

    private static string GetContentTypeFromImageUrl(string imageUrl)
    {
        string extension = default!;
        try
        {
            extension = Path.GetExtension(imageUrl);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
        }

        switch (extension)
        {
            case ".png":
                return "image/png";
            case ".jpg":
            case ".jpeg":
                return "image/jpeg";
            case ".gif":
                return "image/gif";
            default:
                return "image/png";
        }
    }
}
