namespace Projects.Contracts.Requests.Projects;

public class LeaveProjectRequest : IProjectRequest
{
    public string ProjectId { get; set; } = default!;
}

public class LeaveProjectRequestValidator : AbstractValidator<LeaveProjectRequest>
{
    public LeaveProjectRequestValidator()
    {
        RuleFor(v => v.ProjectId)
            .NotNull()
            .WithMessage("Id cannot be null")
            .NotEmpty()
            .WithMessage("Id cannot be empty");
    }
}
