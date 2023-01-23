namespace dotnetapi.Features.Messages.Entities;

public class LastGroupChatMessageDto
{
    public int GroupChatId { get; set; } = default!;
    public GroupChatMessageDto? Message { get; set; } = default!;
}