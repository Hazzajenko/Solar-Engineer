namespace dotnetapi.Features.Images.Contracts.Requests;

public class UploadImageRequest
{
    public IFormFile File { get; set; } = default!;
}