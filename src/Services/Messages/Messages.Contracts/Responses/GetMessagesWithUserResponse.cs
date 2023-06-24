using Messages.Contracts.Data;

namespace Messages.Contracts.Responses;

public class GetMessagesWithUserResponse
{
    public string UserId { get; set; } = default!;
    public IEnumerable<MessageDto> Messages { get; set; } = default!;
}
