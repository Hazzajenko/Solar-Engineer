using Projects.Domain.Entities;

namespace Projects.Contracts.Requests.PanelLinks;

public class CreatePanelLinkRequest : IProjectEventRequest
{
    public required string ProjectId { get; init; }
    public required PanelLinkObject PanelLink { get; init; }
}

public class PanelLinkObject
{
    public required string Id { get; init; }
    public required string StringId { get; init; }
    public required string PositivePanelId { get; init; }
    public required string NegativePanelId { get; init; }
    public required IEnumerable<PanelLink.LinePoint> LinePoints { get; init; }
}

public class CreatePanelLinkRequestValidator : AbstractValidator<CreatePanelLinkRequest>
{
    public CreatePanelLinkRequestValidator()
    {
        RuleFor(v => v.ProjectId)
            .NotNull()
            .WithMessage("ProjectId cannot be null")
            .NotEmpty()
            .WithMessage("ProjectId cannot be empty")
            .Must(x => Guid.TryParse(x, out _))
            .WithMessage("ProjectId must be a valid Guid");

        RuleFor(v => v.PanelLink).NotNull().WithMessage("PanelLink cannot be null");

        RuleFor(v => v.PanelLink.Id)
            .NotNull()
            .WithMessage("PanelLinkId cannot be null")
            .NotEmpty()
            .WithMessage("PanelLinkId cannot be empty")
            .Must(x => Guid.TryParse(x, out _))
            .WithMessage("PanelLinkId must be a valid Guid");

        RuleFor(v => v.PanelLink.StringId)
            .NotNull()
            .WithMessage("StringId cannot be null")
            .NotEmpty()
            .WithMessage("StringId cannot be empty")
            .Must(x => Guid.TryParse(x, out _))
            .WithMessage("StringId must be a valid Guid");

        RuleFor(v => v.PanelLink.PositivePanelId)
            .NotNull()
            .WithMessage("PositiveToId cannot be null")
            .NotEmpty()
            .WithMessage("PositiveToId cannot be empty")
            .Must(x => Guid.TryParse(x, out _))
            .WithMessage("PositiveToId must be a valid Guid");

        RuleFor(v => v.PanelLink.NegativePanelId)
            .NotNull()
            .WithMessage("NegativeToId cannot be null")
            .NotEmpty()
            .WithMessage("NegativeToId cannot be empty")
            .Must(x => Guid.TryParse(x, out _))
            .WithMessage("NegativeToId must be a valid Guid");
    }
}
