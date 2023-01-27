namespace dotnetapi.Features.Messages.Entities;

public class LatestUserMessageDto
{
    public string UserName { get; set; } = default!;
    public MessageDto? Message { get; set; } = default!;
}