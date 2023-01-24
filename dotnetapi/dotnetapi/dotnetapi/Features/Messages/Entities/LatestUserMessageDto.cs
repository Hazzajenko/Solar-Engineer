namespace dotnetapi.Features.Messages.Entities;

public class LatestUserMessageDto
{
    public string Username { get; set; } = default!;
    public MessageDto? Message { get; set; } = default!;
}