using FluentValidation;

namespace Projects.Domain.Contracts.Requests.Projects;

public class CreateProjectRequest
{
    public string Name { get; set; } = default!;
}

public class CreateProjectRequestValidator : AbstractValidator<CreateProjectRequest>
{
    public CreateProjectRequestValidator()
    {
        RuleFor(v => v.Name)
            .NotNull()
            .WithMessage("Name cannot be null")
            .NotEmpty()
            .WithMessage("Name cannot be empty");
    }
}