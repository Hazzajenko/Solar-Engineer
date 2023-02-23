namespace Messages.API.Contracts.Data;

public class LatestUserMessageDto
{
    public string UserId { get; set; } = default!;
    public MessageDto? Message { get; set; } = default!;
}