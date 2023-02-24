using FluentValidation;

namespace Projects.API.Contracts.Requests;

public class UpdateProjectRequest
{
    public string ProjectId { get; set; } = default!;

    public ProjectChanges Changes { get; set; } = default!;
}

public class ProjectChanges
{
    public string? Name { get; set; } = default!;
}

public class UpdateProjectRequestValidator : AbstractValidator<UpdateProjectRequest>
{
    public UpdateProjectRequestValidator()
    {
        RuleFor(v => v.ProjectId)
            .NotNull()
            .WithMessage("Id cannot be null")
            .NotEmpty()
            .WithMessage("Id cannot be empty");

        RuleFor(v => v.Changes)
            .NotNull()
            .WithMessage("Changes cannot be null")
            .NotEmpty()
            .WithMessage("Changes cannot be empty");
    }
}