namespace Projects.Contracts.Requests.Projects;

public class DeleteProjectRequest
{
    public string ProjectId { get; set; } = default!;
}

public class DeleteProjectRequestValidator : AbstractValidator<DeleteProjectRequest>
{
    public DeleteProjectRequestValidator()
    {
        RuleFor(v => v.ProjectId)
            .NotNull()
            .WithMessage("Id cannot be null")
            .NotEmpty()
            .WithMessage("Id cannot be empty");
    }
}