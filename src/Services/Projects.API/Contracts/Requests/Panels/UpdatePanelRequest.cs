using FluentValidation;

namespace Projects.API.Contracts.Requests.Panels;

public class UpdatePanelRequest
{
    public required string Id { get; init; } = default!;
    public required string ProjectId { get; init; } = default!;
    public required string StringId { get; init; }
    public PanelChanges Changes { get; init; } = default!;
}

public class PanelChanges
{
    public string? Location { get; init; }
    public string? PanelConfigId { get; init; }
    public int? Rotation { get; init; }
}

public class UpdatePanelRequestValidator : AbstractValidator<UpdatePanelRequest>
{
    public UpdatePanelRequestValidator()
    {
        RuleFor(v => v.Id)
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

        RuleFor(v => v.StringId)
            .NotNull()
            .WithMessage("StringId cannot be null")
            .NotEmpty()
            .WithMessage("StringId cannot be empty")
            .Must(x => Guid.TryParse(x, out _))
            .WithMessage("StringId must be a valid Guid");

        RuleFor(v => v.Changes)
            .NotNull()
            .WithMessage("Changes cannot be null")
            .NotEmpty()
            .WithMessage("Changes cannot be empty")
            .Must(
                x => x.Location is not null || x.PanelConfigId is not null || x.Rotation is not null
            )
            .WithMessage("Changes cannot be empty");
    }
}