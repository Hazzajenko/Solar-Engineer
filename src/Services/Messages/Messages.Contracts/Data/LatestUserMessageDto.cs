namespace Messages.Contracts.Data;

public class LatestUserMessageDto
{
    public string UserId { get; set; } = default!;
    public MessageDto? Message { get; set; } = default!;
}