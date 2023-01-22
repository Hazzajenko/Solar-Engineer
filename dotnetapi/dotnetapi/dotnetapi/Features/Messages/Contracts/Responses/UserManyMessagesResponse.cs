using dotnetapi.Features.Messages.Entities;

namespace dotnetapi.Features.Messages.Contracts.Responses;

public class UserManyMessagesResponse
{
    public string MessagesWith { get; set; } = default!;
    public IEnumerable<MessageDto> Messages { get; init; } = Enumerable.Empty<MessageDto>();
}