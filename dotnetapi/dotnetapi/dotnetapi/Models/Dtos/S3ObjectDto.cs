namespace dotnetapi.Models.Dtos;

public class S3ObjectDto
{
    public string? Name { get; set; } = default!;
    public string? PresignedUrl { get; set; } = default!;
}