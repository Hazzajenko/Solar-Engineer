using FluentValidation;

namespace dotnetapi.Features.Users.Contracts.Requests;

public class UpdateAppUserLinkNickNameRequest
{
    public string UserName { get; set; } = default!;
    public string ToUpdateUserName { get; set; } = default!;
    public string NickName { get; set; } = default!;
}

public enum AppUserLinkEvent
{
    None,
    EditUserNickName,
    EditRecipientNickName
}

public class UpdateAppUserLinkNickNameRequestRequestValidator : AbstractValidator<UpdateAppUserLinkNickNameRequest>
{
    public UpdateAppUserLinkNickNameRequestRequestValidator()
    {
        RuleFor(v => v.UserName)
            .NotNull()
            .WithMessage("UserName cannot be null")
            .NotEmpty()
            .WithMessage("UserName cannot be empty");

        RuleFor(v => v.ToUpdateUserName)
            .NotNull()
            .WithMessage("ToUpdateUserName cannot be null")
            .NotEmpty()
            .WithMessage("ToUpdateUserName cannot be empty");

        RuleFor(v => v.NickName)
            .NotNull()
            .WithMessage("NickName cannot be null")
            .NotEmpty()
            .WithMessage("NickName cannot be empty");
    }
}