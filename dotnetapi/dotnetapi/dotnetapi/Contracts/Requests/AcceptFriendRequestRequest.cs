using FluentValidation;

namespace dotnetapi.Contracts.Requests;

public class GenericUserNameRequest
{
    public string UserName { get; set; } = default!;
}

public class GenericUserNameRequestValidator : AbstractValidator<GenericUserNameRequest>
{
    public GenericUserNameRequestValidator()
    {
        RuleFor(v => v.UserName)
            .NotNull()
            .WithMessage("UserName cannot be null")
            .NotEmpty()
            .WithMessage("UserName cannot be empty");
    }
}