namespace dotnetapi.Features.GroupChats.Entities;

public class LastGroupChatMessageDto
{
    public int GroupChatId { get; set; } = default!;
    public GroupChatMessageDto? Message { get; set; } = default!;
}