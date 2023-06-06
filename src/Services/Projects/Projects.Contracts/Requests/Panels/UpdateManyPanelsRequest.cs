namespace Projects.Contracts.Requests.Panels;

public class UpdateManyPanelsRequest : IProjectEventRequest
{
    public required string ProjectId { get; init; }
    public required IEnumerable<PanelUpdate> Updates { get; init; }
}

public class UpdateManyPanelsRequestValidator : AbstractValidator<UpdateManyPanelsRequest>
{
    public UpdateManyPanelsRequestValidator()
    {
        RuleFor(v => v.ProjectId)
            .NotNull()
            .WithMessage("ProjectId cannot be null")
            .NotEmpty()
            .WithMessage("ProjectId cannot be empty")
            .Must(x => Guid.TryParse(x, out _))
            .WithMessage("ProjectId must be a valid Guid");

        RuleFor(v => v.Updates)
            .NotNull()
            .WithMessage("Updates cannot be null")
            .NotEmpty()
            .WithMessage("Updates cannot be empty");
    }
}