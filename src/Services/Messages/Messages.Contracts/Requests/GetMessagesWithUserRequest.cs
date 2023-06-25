using FluentValidation;

namespace Messages.Contracts.Requests;

public class GetMessagesWithUserRequest
{
    public string UserId { get; set; } = default!;
}

public class GetMessagesWithUserRequestValidator : AbstractValidator<GetMessagesWithUserRequest>
{
    public GetMessagesWithUserRequestValidator()
    {
        RuleFor(v => v.UserId)
            .NotNull()
            .WithMessage("UserId cannot be null")
            .NotEmpty()
            .WithMessage("UserId cannot be empty");
    }
}
