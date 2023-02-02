namespace dotnetapi.Features.Images.Entities;

public class ImageDto
{
    public ImageDto(string folderName, string fileName)
    {
        FolderName = folderName;
        FileName = fileName;
        PublicId = $"{folderName}/{fileName}";
    }

    public string FolderName { get; }
    public string FileName { get; }
    public string PublicId { get; }
}