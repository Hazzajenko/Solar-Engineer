namespace Projects.Contracts.Requests.Panels;

public class DeleteManyPanelsRequest : IProjectEventRequest
{
    public required string ProjectId { get; set; } = default!;

    public required IEnumerable<string> PanelIds { get; set; } = default!;

    /*public required IEnumerable<DeletePanelRequest> PanelIds { get; init; } =
        new List<DeletePanelRequest>();*/
}

public class DeleteManyPanelsRequestValidator : AbstractValidator<DeleteManyPanelsRequest>
{
    public DeleteManyPanelsRequestValidator()
    {
        RuleFor(v => v.ProjectId)
            .NotNull()
            .WithMessage("ProjectId cannot be null")
            .NotEmpty()
            .WithMessage("ProjectId cannot be empty")
            .Must(x => Guid.TryParse(x, out _))
            .WithMessage("ProjectId must be a valid Guid");

        RuleFor(v => v.PanelIds)
            .NotNull()
            .WithMessage("PanelIds cannot be null")
            .NotEmpty()
            .WithMessage("PanelIds cannot be empty");

        RuleForEach(v => v.PanelIds)
            .Must(x => Guid.TryParse(x, out _))
            .WithMessage("PanelIds must be a valid Guid");
    }
}
