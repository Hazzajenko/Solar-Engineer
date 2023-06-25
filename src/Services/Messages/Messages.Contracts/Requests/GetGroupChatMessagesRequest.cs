using FluentValidation;

namespace Messages.Contracts.Requests;

public class GetGroupChatMessagesRequest
{
    public string GroupChatId { get; set; } = default!;
}

public class GetGroupChatMessagesRequestValidator : AbstractValidator<GetGroupChatMessagesRequest>
{
    public GetGroupChatMessagesRequestValidator()
    {
        RuleFor(v => v.GroupChatId)
            .NotNull()
            .WithMessage("UserId cannot be null")
            .NotEmpty()
            .WithMessage("UserId cannot be empty");
    }
}
