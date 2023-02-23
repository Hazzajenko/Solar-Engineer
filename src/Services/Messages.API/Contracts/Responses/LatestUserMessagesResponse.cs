using Messages.API.Contracts.Data;

namespace Messages.API.Contracts.Responses;

public class LatestUserMessagesResponse
{
    public IEnumerable<LatestUserMessageDto> Messages { get; set; } = default!;
}