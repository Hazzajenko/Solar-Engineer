using FluentValidation;

namespace Projects.Domain.Contracts.Requests.Projects;

public class CreateProjectRequest
{
    public string Name { get; set; } = default!;
    public string Colour { get; set; } = default!;
    public IEnumerable<string> MemberIds { get; set; } = default!;
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
        RuleFor(v => v.Colour)
            .NotNull()
            .WithMessage("Colour cannot be null")
            .NotEmpty()
            .WithMessage("Colour cannot be empty");
        RuleForEach(v => v.MemberIds)
            .NotNull()
            .WithMessage("MemberId cannot be null")
            .NotEmpty()
            .WithMessage("MemberId cannot be empty");
    }
}