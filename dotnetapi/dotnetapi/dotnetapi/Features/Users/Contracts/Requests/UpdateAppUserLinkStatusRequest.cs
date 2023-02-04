using dotnetapi.Models.Entities;
using FluentValidation;

namespace dotnetapi.Features.Users.Contracts.Requests;

public class UpdateAppUserLinkStatusRequest
{
    public string UserName { get; set; } = default!;

    public UserToUserStatus Status { get; set; } = default!;
}

public class UpdateAppUserLinkStatusRequestValidator : AbstractValidator<UpdateAppUserLinkStatusRequest>
{
    public UpdateAppUserLinkStatusRequestValidator()
    {
        RuleFor(v => v.UserName)
            .NotNull()
            .WithMessage("UserName cannot be null")
            .NotEmpty()
            .WithMessage("UserName cannot be empty");

        RuleFor(v => v.Status)
            .NotNull()
            .WithMessage("Status cannot be null")
            .NotEqual(UserToUserStatus.None)
            .WithMessage("Status cannot be none")
            .NotEmpty()
            .WithMessage("Status cannot be empty");
    }
}