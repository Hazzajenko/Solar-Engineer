using FluentValidation;

namespace Messages.Contracts.Requests;

public class SendMessageRequest
{
    public string RecipientUserId { get; set; } = default!;
    public string Content { get; set; } = default!;
}

public class SendMessageRequestValidator : AbstractValidator<SendMessageRequest>
{
    public SendMessageRequestValidator()
    {
        RuleFor(v => v.RecipientUserId)
            .NotNull()
            .WithMessage("UserId cannot be null")
            .NotEmpty()
            .WithMessage("UserId cannot be empty");

        RuleFor(v => v.Content)
            .NotNull()
            .WithMessage("Content cannot be null")
            .NotEmpty()
            .WithMessage("Content cannot be empty");
    }
}