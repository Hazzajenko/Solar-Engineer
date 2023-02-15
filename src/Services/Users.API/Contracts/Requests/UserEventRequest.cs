using FluentValidation;

namespace Users.API.Contracts.Requests;

public class UserEventRequest
{
    public string UserId { get; set; } = default!;
    public string Event { get; set; } = default!;
}

public class UserEventRequestValidator : AbstractValidator<UserEventRequest>
{
    public UserEventRequestValidator()
    {
        RuleFor(v => v.UserId)
            .NotNull()
            .WithMessage("UserId cannot be null")
            .NotEmpty()
            .WithMessage("UserId cannot be empty");
        RuleFor(v => v.Event)
            .NotNull()
            .WithMessage("Event cannot be null")
            .NotEmpty()
            .WithMessage("Event cannot be empty");
    }
}

public static class UserEvent
{
    public const string SendFriendRequest = "SEND_FRIEND_REQUEST";
    public const string AcceptFriendRequest = "ACCEPT_FRIEND_REQUEST";
    public const string RejectFriendRequest = "REJECT_FRIEND_REQUEST";
}