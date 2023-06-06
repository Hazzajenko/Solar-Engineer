namespace Projects.Contracts.Requests.Strings;

public class DeleteStringRequest : IProjectEventRequest
{
    public required string ProjectId { get; init; }
    public required string StringId { get; init; }
}

public class DeleteStringRequestValidator : AbstractValidator<DeleteStringRequest>
{
    public DeleteStringRequestValidator()
    {
        RuleFor(v => v.ProjectId)
            .NotNull()
            .WithMessage("Id cannot be null")
            .NotEmpty()
            .WithMessage("Id cannot be empty")
            .Must(x => Guid.TryParse(x, out _))
            .WithMessage("Id must be a valid Guid");

        RuleFor(v => v.StringId)
            .NotNull()
            .WithMessage("Id cannot be null")
            .NotEmpty()
            .WithMessage("Id cannot be empty")
            .Must(x => Guid.TryParse(x, out _))
            .WithMessage("Id must be a valid Guid");
    }
}