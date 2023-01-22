namespace dotnetapi.Features.Messages.Contracts.Requests;

public class SendGroupChatMessageRequest
{
    public int GroupChatId { get; set; }
    public string Content { get; set; } = default!;
}