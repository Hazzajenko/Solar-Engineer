using Messages.Contracts.Data;

namespace Messages.Contracts.Responses;

public class ReceiveMessageResponse
{
    public MessageDto Message { get; set; } = default!;
}