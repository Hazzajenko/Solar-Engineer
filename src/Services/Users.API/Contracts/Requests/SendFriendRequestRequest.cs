using FluentValidation;

namespace Users.API.Contracts.Requests;

public class SendFriendRequestRequest
{
    public string UserName { get; set; } = default!;
}

public class SendFriendRequestRequestValidator : AbstractValidator<SendFriendRequestRequest>
{
    public SendFriendRequestRequestValidator()
    {
        RuleFor(v => v.UserName)
            .NotNull()
            .WithMessage("UserName cannot be null")
            .NotEmpty()
            .WithMessage("UserName cannot be empty");
    }
}