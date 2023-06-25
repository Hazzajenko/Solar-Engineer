using Messages.Contracts.Data;

namespace Messages.Contracts.Responses;

public class GetLatestMessagesResponse
{
    public IEnumerable<MessagePreviewDto> Messages { get; set; } = default!;
}
