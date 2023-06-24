using ApplicationCore.Extensions;
using Infrastructure.Extensions;

namespace Projects.Contracts.Requests.Projects;

public class InviteUserToProjectRequest
{
    public string ProjectId { get; set; } = default!;

    public IEnumerable<UserProjectInvite> Invites { get; set; } = default!;
}

public class UserProjectInvite
{
    public required string UserId { get; set; } = default!;
    public required string Role { get; set; } = "Member";
    public bool CanCreate { get; set; }
    public bool CanDelete { get; set; }
    public bool CanInvite { get; set; }
    public bool CanKick { get; set; }
}

public class InviteToProjectRequestValidator : AbstractValidator<InviteUserToProjectRequest>
{
    public InviteToProjectRequestValidator()
    {
        RuleFor(v => v.ProjectId)
            .NotNull()
            .WithMessage("Id cannot be null")
            .NotEmpty()
            .WithMessage("Id cannot be empty")
            .Must(id => id.TryToGuid())
            .WithMessage("Id must be a valid Guid");

        RuleFor(v => v.Invites)
            .NotNull()
            .WithMessage("Changes cannot be null")
            .NotEmpty()
            .WithMessage("Changes cannot be empty")
            .Must(invites => invites.All(i => i.Role == "Admin" || i.Role == "Member"))
            .WithMessage("Role must be either Admin or Member")
            .Must(invites => invites.All(i => i.UserId.IsStringNullOrEmpty() is false))
            .WithMessage("UserId cannot be null")
            .Must(invites => invites.All(i => i.UserId.TryToGuid()))
            .WithMessage("UserId must be a valid Guid");
    }
}
