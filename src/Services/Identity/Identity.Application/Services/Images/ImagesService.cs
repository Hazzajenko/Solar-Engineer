using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Identity.Application.Settings;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Identity.Application.Services.Images;

public class ImagesService : IImagesService
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILogger<ImagesService> _logger;
    private readonly IOptions<StorageSettings> _storageSettings;

    public ImagesService(
        IHttpClientFactory httpClientFactory,
        IOptions<StorageSettings> storageSettings, ILogger<ImagesService> logger)
    {
        _httpClientFactory = httpClientFactory;
        _storageSettings = storageSettings;
        _logger = logger;
    }


    public async Task<string> DownloadImageAsync(string imageUrl)
    {
        var blobServiceClient = new BlobServiceClient(_storageSettings.Value.ConnectionString);
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

    /*public async Task<byte[]> GenerateProfilePicture(string initials)
    {
        var size = 30;
        var bitmap = new SKBitmap(size, size, SKColorType.Rgba8888, SKAlphaType.Premul);

        using (var canvas = new SKCanvas(bitmap))
        {
            canvas.Clear(SKColors.LightGray);

            using (var paint = new SKPaint())
            {
                paint.Typeface = SKTypeface.FromFamilyName(
                    "Arial",
                    SKFontStyleWeight.Normal,
                    SKFontStyleWidth.Normal,
                    SKFontStyleSlant.Upright
                );
                paint.TextSize = size / 2;
                paint.Color = SKColors.White;
                paint.IsAntialias = true;

                var textBounds = new SKRect();
                paint.MeasureText(initials, ref textBounds);
                var x = (size - textBounds.Width) / 2;
                var y = (size + textBounds.Height) / 2;

                canvas.DrawText(initials, x, y, paint);
            }
        }

        var result = await Task.Run(
            () =>
            {
                using var image = SKImage.FromBitmap(bitmap);
                using var data = image.Encode(SKEncodedImageFormat.Png, 100);
                return data.ToArray();
            },
            cT
        );

        _logger.LogInformation("Image generated for initials: {Initials}", command.Initials);
        return new CreateDpImageResponse
        {
            ImageUrl = $"data:image/png;base64,{Convert.ToBase64String(result)}"
        };
    }*/

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