using FluentValidation;

namespace Infrastructure.Contracts.Request;

public class UserIdRequest
{
    public string UserId { get; set; } = default!;
}

public class UserIdRequestValidator : AbstractValidator<UserIdRequest>
{
    public UserIdRequestValidator()
    {
        RuleFor(v => v.UserId)
            .NotNull()
            .WithMessage("UserId cannot be null")
            .NotEmpty()
            .WithMessage("UserId cannot be empty");
        RuleFor(v => Guid.Parse(v.UserId))
            .NotEqual(Guid.Empty)
            .WithMessage("Guid cannot be empty")
            .NotNull()
            .WithMessage("UserId cannot be null")
            .NotEmpty()
            .WithMessage("UserId cannot be empty");
    }
}