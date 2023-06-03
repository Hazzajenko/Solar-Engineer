namespace Identity.Application.Services.Images;

public interface IImagesService
{
    // Task<string> UploadImageAsync(IFormFile file, string folderName);
    // Task<string> UploadImageAsync(IFormFile file, string folderName, string fileName);

    // Task<string> UploadImageAsync(IFormFile file, string folderName, string fileName, int width, int height);
    // create a download image async method
    Task<string> DownloadImageAsync(string imageUrl);
    // byte[] GenerateProfilePicture(string initials);

    // Task<string> DownloadImageAsync(string url, string folderName, string fileName);
}