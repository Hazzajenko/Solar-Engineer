using FluentValidation;
using Projects.API.Common;

namespace Projects.API.Contracts.Requests.Panels;

public class CreatePanelRequest : IProjectEventRequest /* : ICreateRequest<PanelCreate>*/
{
    public required string ProjectId { get; init; }
    public required string Id { get; init; }
    public required string StringId { get; init; }
    public required string Location { get; init; }
    public required string PanelConfigId { get; init; }
    public required int Rotation { get; init; }
}

public class CreatePanelRequestValidator : AbstractValidator<CreatePanelRequest>
{
    public CreatePanelRequestValidator()
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

        RuleFor(v => v.Location)
            .NotNull()
            .WithMessage("Location cannot be null")
            .NotEmpty()
            .WithMessage("Location cannot be empty")
            .Must(CheckLocation)
            .WithMessage("Location must be a valid location");

        RuleFor(v => v.Rotation)
            .NotNull()
            .WithMessage("Rotation cannot be null")
            .NotEmpty()
            .WithMessage("Rotation cannot be empty")
            .Must(CheckRotation)
            .WithMessage("Rotation must be a valid location");
    }

    private bool CheckLocation(string location)
    {
        return !string.IsNullOrWhiteSpace(location)
               && location.Contains("row")
               && location.Contains("col");
    }

    private bool CheckRotation(int rotation)
    {
        return rotation >= 0 && rotation <= 2;
    }
}