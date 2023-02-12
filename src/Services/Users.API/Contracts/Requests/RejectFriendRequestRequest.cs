using FluentValidation;

namespace Users.API.Contracts.Requests;

public class RejectFriendRequestRequest
{
    public string UserName { get; set; } = default!;
}

public class RejectFriendRequestRequestValidator : AbstractValidator<RejectFriendRequestRequest>
{
    public RejectFriendRequestRequestValidator()
    {
        RuleFor(v => v.UserName)
            .NotNull()
            .WithMessage("UserName cannot be null")
            .NotEmpty()
            .WithMessage("UserName cannot be empty");
    }
}