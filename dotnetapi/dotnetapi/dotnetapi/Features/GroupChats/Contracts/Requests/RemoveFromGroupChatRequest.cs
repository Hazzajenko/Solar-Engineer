namespace dotnetapi.Features.GroupChats.Contracts.Requests;

public class RemoveFromGroupChatRequest
{
    public IEnumerable<string> UserNames { get; set; } = default!;
}