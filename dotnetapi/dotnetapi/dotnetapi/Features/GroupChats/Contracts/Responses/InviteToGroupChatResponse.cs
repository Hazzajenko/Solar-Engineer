using dotnetapi.Features.GroupChats.Entities;

namespace dotnetapi.Features.GroupChats.Contracts.Responses;

public class InviteToGroupChatResponse
{
    public GroupChatMemberDto Member { get; set; } = default!;
    /*[Required] public string Recipient { get; set; } = default!;
    public string Role { get; set; } = default!;*/
}