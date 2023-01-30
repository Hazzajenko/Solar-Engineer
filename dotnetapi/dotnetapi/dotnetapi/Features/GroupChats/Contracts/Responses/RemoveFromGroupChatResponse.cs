namespace dotnetapi.Features.GroupChats.Contracts.Responses;

public class RemoveFromGroupChatResponse
{
    public IEnumerable<int> Removed { get; set; } = default!;
}