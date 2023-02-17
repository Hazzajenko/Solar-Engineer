using FluentValidation;

namespace Messages.API.Contracts.Requests;

public class SendGroupChatMessageRequest
{
    public string GroupChatId { get; set; } = default!;
    public string Content { get; set; } = default!;
}

public class SendGroupChatMessageRequestValidator : AbstractValidator<SendGroupChatMessageRequest>
{
    public SendGroupChatMessageRequestValidator()
    {
        RuleFor(v => v.GroupChatId)
            .NotNull()
            .WithMessage("GroupChatId cannot be null")
            .NotEmpty()
            .WithMessage("GroupChatId cannot be empty");

        RuleFor(v => v.Content)
            .NotNull()
            .WithMessage("Content cannot be null")
            .NotEmpty()
            .WithMessage("Content cannot be empty");
    }
}