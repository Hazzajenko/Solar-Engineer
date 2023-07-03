using Identity.Contracts.Data;
using Microsoft.AspNetCore.Http;

namespace Identity.Application.Services.AzureStorage;

public interface IAzureStorage
{
    Task<BlobResponseDto> UploadImageToBlobStorage(byte[] imageBytes, string blobName);
}
