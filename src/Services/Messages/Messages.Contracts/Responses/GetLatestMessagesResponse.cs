using Messages.Contracts.Data;

namespace Messages.Contracts.Responses;

public class GetLatestMessagesResponse
{
    public IEnumerable<LatestUserMessageDto> Messages { get; set; } = default!;
}
