using Identity.Domain;

namespace Identity.Application.Services.Images;

public interface IImagesService
{
    byte[] CreateDpImageToByteArray(AppUser appUser);
    byte[] CreateDpImageFromInitialsToByteArray(string initials);
    // Task<string> DownloadImageAsync(string imageUrl);
}
