namespace dotnetapi.Models.Dtos;

public class MessageDto
{
    public string RecipientUsername { get; set; } = default!;
    public string Content { get; set; } = default!;
}