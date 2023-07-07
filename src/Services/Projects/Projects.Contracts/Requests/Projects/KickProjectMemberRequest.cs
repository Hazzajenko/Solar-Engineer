using ApplicationCore.Extensions;
using Infrastructure.Extensions;

namespace Projects.Contracts.Requests.Projects;

public class KickProjectMemberRequest : IProjectRequest
{
    public string ProjectId { get; set; } = default!;
    public string MemberId { get; set; } = default!;
}

public class KickProjectMemberRequestValidator : AbstractValidator<KickProjectMemberRequest>
{
    public KickProjectMemberRequestValidator()
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
            .WithMessage("MemberId cannot be null")
            .NotEmpty()
            .WithMessage("MemberId cannot be empty")
            .Must(id => id.TryToGuid())
            .WithMessage("MemberId must be a valid Guid");
    }
}
