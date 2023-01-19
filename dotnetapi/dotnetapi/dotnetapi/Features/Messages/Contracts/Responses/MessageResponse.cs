using dotnetapi.Features.Messages.Entities;

namespace dotnetapi.Features.Messages.Contracts.Responses;

public class MessageResponse
{
    public MessageDto Message { get; init; } = default!;
}