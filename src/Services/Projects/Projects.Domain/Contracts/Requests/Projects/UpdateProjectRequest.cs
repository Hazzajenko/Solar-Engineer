using FluentValidation;

namespace Projects.Domain.Contracts.Requests.Projects;

public class UpdateProjectRequest
{
    public required string ProjectId { get; set; }
    public required ProjectChanges Changes { get; set; }
}

// publ

public class ProjectChanges
{
    public string? Name { get; set; } = default!;
    public string? Colour { get; set; } = default!;
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