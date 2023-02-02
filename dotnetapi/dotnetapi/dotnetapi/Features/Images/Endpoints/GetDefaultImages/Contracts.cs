namespace dotnetapi.Features.Images.Endpoints.GetDefaultImages;

public class Contracts
{
    public class GetImage
    {
        public string PublicId { get; set; } = default!;
        public string AbsolutePath { get; set; } = default!;
    }
}