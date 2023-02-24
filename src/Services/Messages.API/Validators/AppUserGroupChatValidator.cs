using FluentValidation;
using Messages.API.Entities;

namespace Messages.API.Validators;

public class AppUserGroupChatValidator : AbstractValidator<AppUserGroupChat>
{
    public AppUserGroupChatValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty();
    }
}