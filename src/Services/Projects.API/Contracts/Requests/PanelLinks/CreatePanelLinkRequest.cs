using FluentValidation;
using Projects.API.Common;

namespace Projects.API.Contracts.Requests.PanelLinks;

public class CreatePanelLinkRequest : IProjectEventRequest
{
    public required string Id { get; init; }
    public required string ProjectId { get; init; }
    public required string StringId { get; init; }
    public required string PanelPositiveToId { get; init; }
    public required string PanelNegativeToId { get; init; }
}

public class CreatePanelLinkRequestValidator : AbstractValidator<CreatePanelLinkRequest>
{
    public CreatePanelLinkRequestValidator()
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

        RuleFor(v => v.PanelPositiveToId)
            .NotNull()
            .WithMessage("PositiveToId cannot be null")
            .NotEmpty()
            .WithMessage("PositiveToId cannot be empty")
            .Must(x => Guid.TryParse(x, out _))
            .WithMessage("PositiveToId must be a valid Guid");

        RuleFor(v => v.PanelNegativeToId)
            .NotNull()
            .WithMessage("NegativeToId cannot be null")
            .NotEmpty()
            .WithMessage("NegativeToId cannot be empty")
            .Must(x => Guid.TryParse(x, out _))
            .WithMessage("NegativeToId must be a valid Guid");
    }
}