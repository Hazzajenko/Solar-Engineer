namespace Identity.Application.Services.Images;

public interface IImagesService
{
    Task<string> DownloadImageAsync(string imageUrl);
}