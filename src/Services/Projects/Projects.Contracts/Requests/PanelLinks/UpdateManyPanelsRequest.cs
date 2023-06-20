using Projects.Domain.Entities;

namespace Projects.Contracts.Requests.PanelLinks;

public class UpdateManyPanelLinksRequest : IProjectEventRequest
{
    public required string ProjectId { get; init; }
    public required IEnumerable<PanelLinkUpdate> Updates { get; init; }
}

public class UpdateManyPanelLinksRequestValidator : AbstractValidator<UpdateManyPanelLinksRequest>
{
    public UpdateManyPanelLinksRequestValidator()
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
