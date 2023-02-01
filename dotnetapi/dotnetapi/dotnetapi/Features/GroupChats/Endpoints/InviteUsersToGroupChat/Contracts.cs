using System.ComponentModel.DataAnnotations;
using FastEndpoints;
using FluentValidation;

namespace dotnetapi.Features.GroupChats.Endpoints.InviteUsersToGroupChat;

public class InviteUsersToGroupChatRequest
{
    public int GroupChatId { get; set; }
    public IEnumerable<UserInvite> Invites { get; set; } = default!;
}

public class UserInvite
{
    [Required] public string UserName { get; set; } = default!;

    public string Role { get; set; } = "Member";
}

public class Validator : Validator<InviteUsersToGroupChatRequest>
{
    public Validator()
    {
        RuleFor(x => x.GroupChatId).NotEmpty().WithMessage("Group Chat ID cannot be empty");

        RuleFor(x => x.Invites).NotEmpty().WithMessage("Invites cannot be empty");
    }
}