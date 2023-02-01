using dotnetapi.Features.GroupChats.Entities;

namespace dotnetapi.Features.GroupChats.Contracts.Responses;

public class CreateGroupChatResponse
{
    public InitialGroupChatDto GroupChat { get; set; } = default!;
}