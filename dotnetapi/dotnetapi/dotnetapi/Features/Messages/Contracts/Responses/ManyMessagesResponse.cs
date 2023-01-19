using dotnetapi.Features.Messages.Entities;

namespace dotnetapi.Features.Messages.Contracts.Responses;

public class ManyMessagesResponse
{
    public IEnumerable<MessageDto> Messages { get; init; } = Enumerable.Empty<MessageDto>();
}