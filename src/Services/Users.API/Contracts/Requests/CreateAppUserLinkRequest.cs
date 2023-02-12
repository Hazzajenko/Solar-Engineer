using FluentValidation;

namespace Users.API.Contracts.Requests;

public class CreateAppUserLinkRequest
{
    public string UserName { get; set; } = default!;
}

public class CreateAppUserLinkValidator : AbstractValidator<CreateAppUserLinkRequest>
{
    public CreateAppUserLinkValidator()
    {
        RuleFor(v => v.UserName)
            .NotNull()
            .WithMessage("UserName cannot be null")
            .NotEmpty()
            .WithMessage("UserName cannot be empty");
    }
}