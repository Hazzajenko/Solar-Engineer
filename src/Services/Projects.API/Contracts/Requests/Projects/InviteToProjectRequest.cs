using FluentValidation;
using Infrastructure.Extensions;
using Microsoft.IdentityModel.Tokens;

namespace Projects.API.Contracts.Requests.Projects;

public class InviteToProjectRequest
{
    public string ProjectId { get; set; } = default!;

    public IEnumerable<ProjectInvite> Invites { get; set; } = default!;
}

public class ProjectInvite
{
    public string UserId { get; set; } = default!;
    public string Role { get; set; } = default!;
    public bool CanCreate { get; set; }
    public bool CanDelete { get; set; }
    public bool CanInvite { get; set; }
    public bool CanKick { get; set; }
}

public class InviteToProjectRequestValidator : AbstractValidator<InviteToProjectRequest>
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
            .Must(invites => invites.All(i => i.UserId.IsNullOrEmpty() is false))
            .WithMessage("UserId cannot be null")
            .Must(invites => invites.All(i => i.UserId.TryToGuid()))
            .WithMessage("UserId must be a valid Guid");
    }
}