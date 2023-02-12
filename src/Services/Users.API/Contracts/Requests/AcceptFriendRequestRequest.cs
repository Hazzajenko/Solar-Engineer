using FluentValidation;

namespace Users.API.Contracts.Requests;

public class AcceptFriendRequestRequest
{
    public string UserName { get; set; } = default!;
}

public class AcceptFriendRequestRequestValidator : AbstractValidator<SendFriendRequestRequest>
{
    public AcceptFriendRequestRequestValidator()
    {
        RuleFor(v => v.UserName)
            .NotNull()
            .WithMessage("UserName cannot be null")
            .NotEmpty()
            .WithMessage("UserName cannot be empty");
    }
}