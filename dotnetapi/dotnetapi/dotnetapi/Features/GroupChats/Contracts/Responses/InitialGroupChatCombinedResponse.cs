using dotnetapi.Features.GroupChats.Entities;

namespace dotnetapi.Features.GroupChats.Contracts.Responses;

public class InitialGroupChatCombinedResponse
{
    public IEnumerable<InitialGroupChatCombinedDto> GroupChats { get; set; } = default!;
}