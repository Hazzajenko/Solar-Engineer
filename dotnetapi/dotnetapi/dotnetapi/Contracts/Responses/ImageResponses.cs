namespace dotnetapi.Contracts.Responses;

public class GetImageResponse
{
    public string Name { get; set; } = default!;
    public IFormFile File { get; set; } = default!;
}