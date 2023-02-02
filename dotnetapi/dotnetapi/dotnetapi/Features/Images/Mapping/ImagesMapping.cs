using CloudinaryDotNet.Actions;
using dotnetapi.Features.Images.Entities;

namespace dotnetapi.Features.Images.Mapping;

public static class ImagesMapping
{
    public static ImageDto ToImageDto(this SearchResource request)
    {
        return new ImageDto(request.Folder, request.FileName);
    }
}