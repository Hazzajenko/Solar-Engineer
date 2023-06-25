using Messages.Contracts.Data;

namespace Messages.Contracts.Responses;

public class GetLatestUserMessagesResponse
{
    public IEnumerable<LatestUserMessageDto> Messages { get; set; } = default!;
}
