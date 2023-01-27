using dotnetapi.Models.Entities;

namespace dotnetapi.Features.Images.Entities;

public class Image
{
    public int Id { get; set; }
    public int AppUserId { get; set; }
    public string AppUserUserName { get; set; } = default!;
    public AppUser AppUser { get; set; } = default!;
    public string Url { get; set; } = default!;
    public string PublicId { get; set; } = default!;
    public int Width { get; set; }
    public int Height { get; set; }
}