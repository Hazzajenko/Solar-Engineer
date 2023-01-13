using dotnetapi.Contracts.Requests.Auth;
using FluentValidation;

namespace dotnetapi.Validation;

public class UserRequestValidator : AbstractValidator<AuthRequest>
{
    public UserRequestValidator()
    {
        RuleFor(x => x.Username)
            .NotEmpty().WithMessage("Username is required")
            .MinimumLength(8).WithMessage("Your username length must be at least 8.")
            .MaximumLength(16).WithMessage("Your username length must not exceed 16.")
            .Matches(@"^[\w{.,'}+:?®©-]+$").WithMessage("Your username can not contain any special characters");
        // RuleFor(x => x.Password).NotEmpty();
        RuleFor(p => p.Password).NotEmpty().WithMessage("Your password cannot be empty")
            .MinimumLength(8).WithMessage("Your password length must be at least 8.")
            .MaximumLength(16).WithMessage("Your password length must not exceed 16.")
            .Matches(@"[A-Z]+").WithMessage("Your password must contain at least one uppercase letter.")
            .Matches(@"[a-z]+").WithMessage("Your password must contain at least one lowercase letter.")
            .Matches(@"[0-9]+").WithMessage("Your password must contain at least one number.");
        // .Matches(@"[\!\?\*\.]+").WithMessage("Your password must contain at least one (!? *.).");
    }
}