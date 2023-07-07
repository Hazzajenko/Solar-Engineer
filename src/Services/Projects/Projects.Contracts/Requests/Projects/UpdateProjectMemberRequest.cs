using ApplicationCore.Extensions;
using Infrastructure.Extensions;

namespace Projects.Contracts.Requests.Projects;

public class UpdateProjectMemberRequest : IProjectRequest
{
    public required string ProjectId { get; set; }
    public required string MemberId { get; set; }
    public required ProjectMemberChanges Changes { get; set; }
}

public class ProjectMemberChanges
{
    public string? Role { get; set; }
    public bool? CanCreate { get; set; }
    public bool? CanDelete { get; set; }
    public bool? CanInvite { get; set; }
    public bool? CanKick { get; set; }
}

public class UpdateProjectMemberRequestValidator : AbstractValidator<UpdateProjectMemberRequest>
{
    public UpdateProjectMemberRequestValidator()
    {
        RuleFor(v => v.ProjectId)
            .NotNull()
            .WithMessage("Id cannot be null")
            .NotEmpty()
            .WithMessage("Id cannot be empty")
            .Must(id => id.TryToGuid())
            .WithMessage("Id must be a valid Guid");

        RuleFor(v => v.MemberId)
            .NotNull()
            .WithMessage("UserId cannot be null")
            .NotEmpty()
            .WithMessage("UserId cannot be empty")
            .Must(id => id.TryToGuid())
            .WithMessage("UserId must be a valid Guid");

        RuleFor(x => x.Changes)
            .NotNull()
            .WithMessage("Changes cannot be null")
            .NotEmpty()
            .WithMessage("Changes cannot be empty")
            .Must(
                x =>
                    x.Role is not null
                    || x.CanCreate is not null
                    || x.CanDelete is not null
                    || x.CanInvite is not null
                    || x.CanKick is not null
            )
            .WithMessage("At least one property must be set");
    }
}
