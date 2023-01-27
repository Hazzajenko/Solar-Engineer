namespace dotnetapi.Features.Messages.Contracts.Requests;

public class SendMessageRequest
{
    // public string SenderUserName { get; set; } = default!;
    public string RecipientUserName { get; set; } = default!;
    public string Content { get; set; } = default!;
}