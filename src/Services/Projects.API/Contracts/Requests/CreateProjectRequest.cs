using FluentValidation;

namespace Projects.API.Contracts.Requests;

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