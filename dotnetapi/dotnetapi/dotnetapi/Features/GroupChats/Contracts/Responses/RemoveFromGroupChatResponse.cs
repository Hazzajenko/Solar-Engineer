using dotnetapi.Features.GroupChats.Entities;

namespace dotnetapi.Features.GroupChats.Contracts.Responses;

public class RemoveFromGroupChatResponse
{
    public IEnumerable<int> RemovedMembers { get; set; } = default!;
    public IEnumerable<GroupChatMessageDto> UpdatedMessages { get; set; } = default!;
}