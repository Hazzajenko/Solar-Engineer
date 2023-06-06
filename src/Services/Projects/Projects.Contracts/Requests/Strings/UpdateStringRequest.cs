namespace Projects.Contracts.Requests.Strings;

public class UpdateStringRequest : IProjectEventRequest
{
    public required string ProjectId { get; init; }

    public required StringUpdate Update { get; init; }
}

public class UpdateStringRequestValidator : AbstractValidator<UpdateStringRequest>
{
    public UpdateStringRequestValidator()
    {
        RuleFor(v => v.Update.Id)
            .NotNull()
            .WithMessage("Id cannot be null")
            .NotEmpty()
            .WithMessage("Id cannot be empty")
            .Must(x => Guid.TryParse(x, out _))
            .WithMessage("Id must be a valid Guid");

        RuleFor(v => v.ProjectId)
            .NotNull()
            .WithMessage("ProjectId cannot be null")
            .NotEmpty()
            .WithMessage("ProjectId cannot be empty")
            .Must(x => Guid.TryParse(x, out _))
            .WithMessage("ProjectId must be a valid Guid");

        RuleFor(v => v.Update.Changes)
            .NotNull()
            .WithMessage("Changes cannot be null")
            .NotEmpty()
            .WithMessage("Changes cannot be empty")
            .Must(
                x => x.Name is not null || x.Colour is not null || x.Parallel is not null
            )
            .WithMessage("Changes cannot be empty");
    }
}