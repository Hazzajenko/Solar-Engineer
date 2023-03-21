using FluentValidation;

namespace Projects.API.Contracts.Requests.Admin;

public class GenerateProjectMembersRequest
{
    public string ProjectId { get; set; } = default!;
    public int NumberOfMembers { get; set; }
}

public class GenerateProjectMembersRequestValidator
    : AbstractValidator<GenerateProjectMembersRequest>
{
    public GenerateProjectMembersRequestValidator()
    {
        RuleFor(v => v.ProjectId)
            .NotNull()
            .WithMessage("ProjectId cannot be null")
            .NotEmpty()
            .WithMessage("ProjectId cannot be empty")
            .Must(x => Guid.TryParse(x, out _))
            .WithMessage("ProjectId must be a valid Guid");

        RuleFor(v => v.NumberOfMembers)
            .NotNull()
            .WithMessage("NumberOfMembers cannot be null")
            .NotEmpty()
            .WithMessage("NumberOfMembers cannot be empty")
            .Must(x => x > 0)
            .WithMessage("NumberOfMembers must be greater than 0");
    }
}