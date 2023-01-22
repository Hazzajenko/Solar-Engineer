using System.ComponentModel.DataAnnotations;

namespace dotnetapi.Features.Conversations.Contracts.Requests;

public class InviteToConversationRequest
{
    public IEnumerable<MemberInvite> Invites { get; set; } = default!;
    /*[Required] public string Recipient { get; set; } = default!;
    public string Role { get; set; } = default!;*/
    // public ConversationMemberDto Member { get; set; } = default!;
}

public class MemberInvite
{
    [Required] public string Recipient { get; set; } = default!;
    public string Role { get; set; } = "Member";
}