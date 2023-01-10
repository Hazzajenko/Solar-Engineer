using dotnetapi.Controllers;
using FluentValidation;

namespace dotnetapi.Validation;

public class UserRequestValidator : AbstractValidator<SigninRequest>
{
    public UserRequestValidator()
    {
        RuleFor(x => x.Username).NotEmpty();
        RuleFor(x => x.Password).NotEmpty();
    }
}