using dotnetapi.Features.Messages.Entities;

namespace dotnetapi.Features.Messages.Contracts.Responses;

public class ManyLatestUserMessagesResponse
{
    public IEnumerable<LatestUserMessageDto> Messages { get; init; } = default!;
}