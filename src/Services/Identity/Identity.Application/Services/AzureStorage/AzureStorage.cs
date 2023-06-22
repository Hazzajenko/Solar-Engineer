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
        // var base64Data = base64Image.Substring(base64Image.IndexOf(",", StringComparison.Ordinal) + 1);
        // byte[] imageBytes = Convert.FromBase64String(base64Data);

        BlobContainerClient container = new BlobContainerClient(
            _storageSettings.ConnectionString,
            _storageSettings.ContainerName
        );

        await container.CreateIfNotExistsAsync();

        var pngFileName = blobName.Contains(".png") ? blobName : $"{blobName}.png";
        // var pngFileName = $"{blobName}.png";

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

        var blobClient = containerClient.GetBlobClient(blobName);

        using (var stream = image.OpenReadStream())
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

    /*
    public async Task<BlobResponseDto> UploadImageAsync(string base64Image, string blobName)
    {
        // Create new upload response object that we can return to the requesting method
        BlobResponseDto response = new();

        // Get a reference to a container named in appsettings.json and then create it
        var container = new BlobContainerClient(_storageConnectionString, _storageContainerName);
        //await container.CreateAsync();
        try
        {
            // Strip off the "data:image/png;base64," part
            var base64Data = base64Image.Substring(base64Image.IndexOf(",") + 1);
            byte[] imageBytes = Convert.FromBase64String(base64Data);
            // Get a reference to the blob just uploaded from the API in a container from configuration settings
            var client = container.GetBlobClient(blobName);

            using (Stream stream = new MemoryStream(imageBytes))
            {
                await client.UploadAsync(stream);
                // await blob.UploadFromStreamAsync(stream);
            }

            // // Open a stream for the file we want to upload
            // await using (var data = imageBytes.OpenReadStream())
            // {
            //     // Upload the file async
            //     await client.UploadAsync(data);
            // }

            // Everything is OK and file got uploaded
            response.Status = $"File {blobName} Uploaded Successfully";
            response.Error = false;
            response.Blob.Uri = client.Uri.AbsoluteUri;
            response.Blob.Name = client.Name;
        }
        // If the file already exists, we catch the exception and do not upload it
        catch (RequestFailedException ex) when (ex.ErrorCode == BlobErrorCode.BlobAlreadyExists)
        {
            _logger.LogError(
                $"File with name {blobName} already exists in container. Set another name to store the file in the container: '{_storageContainerName}.'"
            );
            response.Status =
                $"File with name {blobName} already exists. Please use another name to store your file.";
            response.Error = true;
            return response;
        }
        // If we get an unexpected error, we catch it here and return the error message
        catch (RequestFailedException ex)
        {
            // Log error to console and create a new response we can return to the requesting method
            _logger.LogError($"Unhandled Exception. ID: {ex.StackTrace} - Message: {ex.Message}");
            response.Status = $"Unexpected error: {ex.StackTrace}. Check log with StackTrace ID.";
            response.Error = true;
            return response;
        }

        // Return the BlobUploadResponse object
        return response;
    }

    public async Task<BlobResponseDto> UploadAsync(IFormFile blob)
    {
        // Create new upload response object that we can return to the requesting method
        BlobResponseDto response = new();

        // Get a reference to a container named in appsettings.json and then create it
        var container = new BlobContainerClient(_storageConnectionString, _storageContainerName);
        //await container.CreateAsync();
        try
        {
            // Get a reference to the blob just uploaded from the API in a container from configuration settings
            var client = container.GetBlobClient(blob.FileName);

            // Open a stream for the file we want to upload
            await using (var data = blob.OpenReadStream())
            {
                // Upload the file async
                await client.UploadAsync(data);
            }

            // Everything is OK and file got uploaded
            response.Status = $"File {blob.FileName} Uploaded Successfully";
            response.Error = false;
            response.Blob.Uri = client.Uri.AbsoluteUri;
            response.Blob.Name = client.Name;
        }
        // If the file already exists, we catch the exception and do not upload it
        catch (RequestFailedException ex) when (ex.ErrorCode == BlobErrorCode.BlobAlreadyExists)
        {
            _logger.LogError(
                $"File with name {blob.FileName} already exists in container. Set another name to store the file in the container: '{_storageContainerName}.'"
            );
            response.Status =
                $"File with name {blob.FileName} already exists. Please use another name to store your file.";
            response.Error = true;
            return response;
        }
        // If we get an unexpected error, we catch it here and return the error message
        catch (RequestFailedException ex)
        {
            // Log error to console and create a new response we can return to the requesting method
            _logger.LogError($"Unhandled Exception. ID: {ex.StackTrace} - Message: {ex.Message}");
            response.Status = $"Unexpected error: {ex.StackTrace}. Check log with StackTrace ID.";
            response.Error = true;
            return response;
        }

        // Return the BlobUploadResponse object
        return response;
    }

    public async Task<BlobDto> DownloadAsync(string blobFilename)
    {
        // Get a reference to a container named in appsettings.json
        var client = new BlobContainerClient(_storageConnectionString, _storageContainerName);

        try
        {
            // Get a reference to the blob uploaded earlier from the API in the container from configuration settings
            var file = client.GetBlobClient(blobFilename);

            // Check if the file exists in the container
            if (await file.ExistsAsync())
            {
                var data = await file.OpenReadAsync();
                var blobContent = data;

                // Download the file details async
                var content = await file.DownloadContentAsync();

                // Add data to variables in order to return a BlobDto
                var name = blobFilename;
                var contentType = content.Value.Details.ContentType;

                // Create new BlobDto with blob data from variables
                return new BlobDto
                {
                    Content = blobContent,
                    Name = name,
                    ContentType = contentType
                };
            }
        }
        catch (RequestFailedException ex) when (ex.ErrorCode == BlobErrorCode.BlobNotFound)
        {
            // Log error to console
            _logger.LogError($"File {blobFilename} was not found.");
        }

        // File does not exist, return null and handle that in requesting method
        return null;
    }

    public async Task<BlobResponseDto> DeleteAsync(string blobFilename)
    {
        var client = new BlobContainerClient(_storageConnectionString, _storageContainerName);

        var file = client.GetBlobClient(blobFilename);

        try
        {
            // Delete the file
            await file.DeleteAsync();
        }
        catch (RequestFailedException ex) when (ex.ErrorCode == BlobErrorCode.BlobNotFound)
        {
            // File did not exist, log to console and return new response to requesting method
            _logger.LogError($"File {blobFilename} was not found.");
            return new BlobResponseDto
            {
                Error = true,
                Status = $"File with name {blobFilename} not found."
            };
        }

        // Return a new BlobResponseDto to the requesting method
        return new BlobResponseDto
        {
            Error = false,
            Status = $"File: {blobFilename} has been successfully deleted."
        };
    }

    public async Task<List<BlobDto>> ListAsync()
    {
        // Get a reference to a container named in appsettings.json
        var container = new BlobContainerClient(_storageConnectionString, _storageContainerName);

        // Create a new list object for
        var files = new List<BlobDto>();

        await foreach (var file in container.GetBlobsAsync())
        {
            // Add each file retrieved from the storage container to the files list by creating a BlobDto object
            var uri = container.Uri.ToString();
            var name = file.Name;
            var fullUri = $"{uri}/{name}";

            files.Add(
                new BlobDto
                {
                    Uri = fullUri,
                    Name = name,
                    ContentType = file.Properties.ContentType
                }
            );
        }

        // Return all files to the requesting method
        return files;
    }*/
}
