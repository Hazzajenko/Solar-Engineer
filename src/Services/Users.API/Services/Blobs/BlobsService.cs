namespace Users.API.Services.Blobs;

public class BlobsService
{
    /*public async Task Upload(string name)
    {
        try{
            var filename = GenerateFileName(file.File.FileName, file.FileName);
            var fileUrl = "";
            BlobContainerClient container = new BlobContainerClient("Äzure Connection String",
                "Azure Storage Container name");
            try{
                BlobClient blob = container.GetBlobClient(filename);
                using (Stream stream = file.File.OpenReadStream())
                {
                    blob.Upload(stream);
                }
                fileUrl = blob.Uri.AbsoluteUri;
            }
            catch (Exception ex){}
            var result = fileUrl;
            return Ok(result);
        }
        catch (Exception ex){
            return Ok();
        }
    }*/

    /*
    public async Task DeleteImage(string name)
    {
        var uri = new Uri(name);
        var filename = Path.GetFileName(uri.LocalPath);
        var blobContainer = await _storageConnectionFactory.GetContainer();
        var blob = blobContainer.GetBlockBlobReference(filename);
        await blob.DeleteIfExistsAsync();
    }*/

    /*public static async Task UploadStream
        (string localFilePath)
    {
        var containerClient = new BlobContainerClient("Äzure Connection String",
            "Azure Storage Container name");
        var fileName = Path.GetFileName(localFilePath);
        var blobClient = containerClient.GetBlobClient(fileName);

        var fileStream = File.OpenRead(localFilePath);
        await blobClient.UploadAsync(fileStream, true);
        fileStream.Close();
    }

    public async Task<string> UploadAsync(IFormFile file)
    {
        /*BlobContainerClient blobContainer = new BlobContainerClient("Äzure Connection String",
            "Azure Storage Container name");#1#
        var blobContainer = await _storageConnectionFactory.GetContainer();
        var thumbnailWidth = 100;
        var extension = Path.GetExtension(file.FileName);
        var encoder = GetEncoder(extension);
        CloudBlockBlob blob = blobContainer.GetBlockBlobReference(GetRandomBlobName(file.FileName));
        await using (var stream = file.OpenReadStream())
        {
            using (var output = new MemoryStream())
            using (var image = Image.Load(stream))
            {
                var divisor = image.Width / thumbnailWidth;
                var height = Convert.ToInt32(Math.Round((decimal)(image.Height / divisor)));

                image.Mutate(x => x.Resize(thumbnailWidth, height));
                image.Save(output, encoder);
                output.Position = 0;
                await blob.UploadFromStreamAsync(output);
            }
        }

        return blob.Uri.AbsoluteUri;
    }

    /// <summary>
    ///     string GetRandomBlobName(string filename): Generates a unique random file name to be uploaded
    /// </summary>
    private string GetRandomBlobName(string filename)
    {
        var ext = Path.GetExtension(filename);
        return string.Format("{0:10}_{1}{2}", DateTime.Now.Ticks, Guid.NewGuid(), ext);
    }

    private static IImageEncoder GetEncoder(string extension)
    {
        IImageEncoder encoder = null;

        extension = extension.Replace(".", "");

        var isSupported = Regex.IsMatch(extension, "gif|png|jpe?g", RegexOptions.IgnoreCase);

        if (isSupported)
            switch (extension)
            {
                case "png":
                    encoder = new PngEncoder();
                    break;
                case "jpg":
                    encoder = new JpegEncoder();
                    break;
                case "jpeg":
                    encoder = new JpegEncoder();
                    break;
                case "gif":
                    encoder = new GifEncoder();
                    break;
            }

        return encoder;
    }*/
}