using Auth.API.Settings;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.Extensions.Options;

namespace Auth.API.Services.Images;

public class ImagesService : IImagesService
{
    // private readonly string _connectionString;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IOptions<StorageSettings> _storageSettings;

    public ImagesService(
        IHttpClientFactory httpClientFactory,
        IOptions<StorageSettings> storageSettings
    )
    {
        _httpClientFactory = httpClientFactory;
        _storageSettings = storageSettings;
        /*_connectionString =
            configuration.GetConnectionString("Azure:Storage:ConnectionString")
            ?? throw new InvalidOperationException();*/
    }

    public async Task<string> UploadImageAsync(IFormFile file, string folderName, string fileName)
    {
        throw new NotImplementedException();
    }

    public async Task<string> DownloadImageAsync(string imageUrl)
    {
        // Create a BlobServiceClient object using the connection string.
        var blobServiceClient = new BlobServiceClient(_storageSettings.Value.ConnectionString);

        // Get a reference to the container where you want to upload the image.
        var containerClient = blobServiceClient.GetBlobContainerClient("images");

        // Create a unique name for the blob using a GUID.
        // var blobName = Guid.NewGuid() + ".jpg";
        var extension = ".png";
        // var extension = Path.GetExtension(imageUrl);
        var blobName = Guid.NewGuid() + extension;

        var client = _httpClientFactory.CreateClient("Images");
        var imageData = await client.GetByteArrayAsync(imageUrl);
        var contentType = "image/png";
        // var contentType = GetContentTypeFromImageUrl(imageUrl);

        /*if (fileName.EndsWith(".jpg"))
        {
            cloudBlockBlob.Properties.ContentType = "image/jpg";
        }
        else if (fileName.EndsWith(".pdf"))
        {
            cloudBlockBlob.Properties.ContentType = "application/pdf";
        }*/

        // Upload the image to the blob storage.
        var blobClient = containerClient.GetBlobClient(blobName);

        // blobClient.Properties.ContentType = contentType;
        // var props = await blobClient.GetPropertiesAsync();
        // props.Value.ContentType = contentType;
        // await blobClient.SetHttpHeadersAsync(props.Value);
        // blobClient.SetHttpHeadersAsync(props.Value);
        // blobClient.SetProperty("ContentType", contentType);
        // var blobInfo = await blobClient.SetHttpHeadersAsync(new BlobHttpHeaders { ContentType = contentType });
        // await blobClient.SetMetadataAsync(new Dictionary<string, string> { { "ContentType", contentType } });

        using (var stream = new MemoryStream(imageData))
        {
            // blobClient.BlobContainerName.
            // stream.Con
            await blobClient.UploadAsync(
                stream,
                new BlobHttpHeaders { ContentType = contentType },
                conditions: null
            );
            // await blobClient.UploadAsync(stream);
        }

        // Return the URL of the uploaded image.
        return blobClient.Uri.AbsoluteUri;

        /*byte[] imageData;
        using (var webClient = new WebClient())
        {
            imageData = await webClient.DownloadDataTaskAsync(imageUrl);
        }
        
        
        using (System.Net.WebClient webClient = new System.Net.WebClient())
        {
            using (Stream stream = webClient.OpenRead(imageUrl))
            {
                // stream.
                // return image;
                
                
                // return Image.FromStream(stream);
                
            }
        }*/
    }

    public static string GetContentTypeFromImageUrl(string imageUrl)
    {
        /*var extension = Path.GetExtension(imageUrl);*/
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
            // return "application/octet-stream";
        }
    }
}