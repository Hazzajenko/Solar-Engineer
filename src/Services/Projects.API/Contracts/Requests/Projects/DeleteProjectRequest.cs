using FluentValidation;

namespace Projects.API.Contracts.Requests.Projects;

public class DeleteProjectRequest
{
    public string Id { get; set; } = default!;
}

public class DeleteProjectRequestValidator : AbstractValidator<DeleteProjectRequest>
{
    public DeleteProjectRequestValidator()
    {
        RuleFor(v => v.Id)
            .NotNull()
            .WithMessage("Id cannot be null")
            .NotEmpty()
            .WithMessage("Id cannot be empty");
    }
}