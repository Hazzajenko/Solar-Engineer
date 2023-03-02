using FluentValidation;

namespace Projects.API.Contracts.Requests.Panels;

public class CreatePanelRequest
{
    public required string Id { get; init; } = default!;
    public required string ProjectId { get; init; } = default!;
    public required string StringId { get; init; } = default!;
    public required string Name { get; init; } = default!;
    public required string Location { get; init; } = default!;
    public required string PanelConfigId { get; init; } = "default";
    public required int Rotation { get; init; } = 0;
}

public class CreatePanelRequestValidator : AbstractValidator<CreatePanelRequest>
{
    public CreatePanelRequestValidator()
    {
        RuleFor(v => v.Id)
            .NotNull()
            .WithMessage("Id cannot be null")
            .NotEmpty()
            .WithMessage("Id cannot be empty");

        RuleFor(v => v.ProjectId)
            .NotNull()
            .WithMessage("ProjectId cannot be null")
            .NotEmpty()
            .WithMessage("ProjectId cannot be empty");

        RuleFor(v => v.StringId)
            .NotNull()
            .WithMessage("StringId cannot be null")
            .NotEmpty()
            .WithMessage("StringId cannot be empty");

        RuleFor(v => v.Name)
            .NotNull()
            .WithMessage("Name cannot be null")
            .NotEmpty()
            .WithMessage("Name cannot be empty");

        RuleFor(v => v.Location)
            .NotNull()
            .WithMessage("Location cannot be null")
            .NotEmpty()
            .WithMessage("Location cannot be empty");

        RuleFor(v => v.Rotation)
            .NotNull()
            .WithMessage("Rotation cannot be null")
            .NotEmpty()
            .WithMessage("Rotation cannot be empty")
            .Must(r => r is >= 0 and <= 2)
            .WithMessage("Rotation cannot more than 1");
    }
}