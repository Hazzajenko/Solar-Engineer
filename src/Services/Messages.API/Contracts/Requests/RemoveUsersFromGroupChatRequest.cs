using FluentValidation;

namespace Messages.API.Contracts.Requests;

public class RemoveUsersFromGroupChatRequest
{
    public string GroupChatId { get; set; } = default!;
    public IEnumerable<string> UserIds { get; set; } = default!;
}

public class RemoveUsersFromGroupChatRequestValidator : AbstractValidator<RemoveUsersFromGroupChatRequest>
{
    public RemoveUsersFromGroupChatRequestValidator()
    {
        RuleFor(v => v.GroupChatId)
            .NotNull()
            .WithMessage("GroupChatId cannot be null")
            .NotEmpty()
            .WithMessage("GroupChatId cannot be empty");

        RuleFor(v => v.UserIds)
            .NotNull()
            .WithMessage("UserIds cannot be null")
            .NotEmpty()
            .WithMessage("UserIds cannot be empty");
    }
}