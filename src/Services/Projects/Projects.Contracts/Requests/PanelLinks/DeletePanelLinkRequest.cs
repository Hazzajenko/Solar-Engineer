namespace Projects.Contracts.Requests.PanelLinks;

public class DeletePanelLinkRequest : IProjectEventRequest
{
    public required string ProjectId { get; set; }
    public required string PanelLinkId { get; init; }
}

public class DeletePanelLinkRequestValidator : AbstractValidator<DeletePanelLinkRequest>
{
    public DeletePanelLinkRequestValidator()
    {
        RuleFor(v => v.ProjectId)
            .NotNull()
            .WithMessage("ProjectId cannot be null")
            .NotEmpty()
            .WithMessage("ProjectId cannot be empty")
            .Must(x => Guid.TryParse(x, out _))
            .WithMessage("ProjectId must be a valid Guid");

        RuleFor(v => v.PanelLinkId)
            .NotNull()
            .WithMessage("PanelLinkId cannot be null")
            .NotEmpty()
            .WithMessage("PanelLinkId cannot be empty")
            .Must(x => Guid.TryParse(x, out _))
            .WithMessage("PanelLinkId must be a valid Guid");
    }
}
