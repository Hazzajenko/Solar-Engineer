using FluentValidation;

namespace Messages.Contracts.Requests;

public class InviteUsersToGroupChatRequest
{
    public string GroupChatId { get; set; } = default!;
    public IEnumerable<UserInvite> Invites { get; set; } = default!;
}

public class InviteUsersToGroupChatRequestValidator : AbstractValidator<InviteUsersToGroupChatRequest>
{
    public InviteUsersToGroupChatRequestValidator()
    {
        RuleFor(v => v.GroupChatId)
            .NotNull()
            .WithMessage("GroupChatId cannot be null")
            .NotEmpty()
            .WithMessage("GroupChatId cannot be empty");

        RuleFor(v => v.Invites)
            .NotNull()
            .WithMessage("Invites cannot be null")
            .NotEmpty()
            .WithMessage("Invites cannot be empty");
    }
}