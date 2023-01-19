namespace dotnetapi.Features.Messages.Contracts.Requests;

public class SendMessageRequest
{
    // public string SenderUsername { get; set; } = default!;
    public string RecipientUsername { get; set; } = default!;
    public string Content { get; set; } = default!;
}