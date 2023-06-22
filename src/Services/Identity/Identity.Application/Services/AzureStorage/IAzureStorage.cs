using Identity.Contracts.Data;
using Microsoft.AspNetCore.Http;

namespace Identity.Application.Services.AzureStorage;

public interface IAzureStorage
{
    Task<BlobResponseDto> UploadImageToBlobStorage(byte[] imageBytes, string blobName);
    // Task UploadImageToBlobStorage(string base64Image, string blobName);

    /// <summary>
    ///     This method uploads a file submitted with the request
    /// </summary>
    /// <param name="file">File for upload</param>
    /// <returns>Blob with status</returns>
    /*Task<BlobResponseDto> UploadAsync(IFormFile file);

    /// <summary>
    ///     This method downloads a file with the specified filename
    /// </summary>
    /// <param name="blobFilename">Filename</param>
    /// <returns>Blob</returns>
    Task<BlobDto> DownloadAsync(string blobFilename);

    /// <summary>
    ///     This method deleted a file with the specified filename
    /// </summary>
    /// <param name="blobFilename">Filename</param>
    /// <returns>Blob with status</returns>
    Task<BlobResponseDto> DeleteAsync(string blobFilename);

    /// <summary>
    ///     This method returns a list of all files located in the container
    /// </summary>
    /// <returns>Blobs in a list</returns>
    Task<List<BlobDto>> ListAsync();*/
}
