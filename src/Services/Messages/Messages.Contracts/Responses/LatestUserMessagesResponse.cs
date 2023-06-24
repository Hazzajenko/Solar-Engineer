using Messages.Contracts.Data;

namespace Messages.Contracts.Responses;

public class LatestUserMessagesResponse
{
    public IEnumerable<LatestUserMessageDto> Messages { get; set; } = default!;
}