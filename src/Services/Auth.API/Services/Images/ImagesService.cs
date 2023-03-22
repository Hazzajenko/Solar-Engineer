using Azure.Storage.Blobs;

namespace Auth.API.Services.Images;

public class ImagesService : IImagesService
{
    private readonly string _connectionString;
    private readonly HttpClient _httpClient;

    public ImagesService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient ?? new HttpClient();
        _connectionString =
            configuration.GetConnectionString("Azure:Storage:ConnectionString")
            ?? throw new InvalidOperationException();
    }

    public async Task<string> UploadImageAsync(IFormFile file, string folderName, string fileName)
    {
        throw new NotImplementedException();
    }

    public async Task<string> DownloadImageAsync(string imageUrl)
    {
        // Create a BlobServiceClient object using the connection string.
        var blobServiceClient = new BlobServiceClient(_connectionString);

        // Get a reference to the container where you want to upload the image.
        var containerClient = blobServiceClient.GetBlobContainerClient("images");

        // Create a unique name for the blob using a GUID.
        var blobName = Guid.NewGuid() + ".jpg";

        var imageData = await _httpClient.GetByteArrayAsync(imageUrl);

        // Upload the image to the blob storage.
        var blobClient = containerClient.GetBlobClient(blobName);
        using (var stream = new MemoryStream(imageData))
        {
            await blobClient.UploadAsync(stream);
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
}