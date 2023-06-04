using FluentValidation;
using Projects.Domain.Common;
using Projects.Domain.Entities;

namespace Projects.Domain.Contracts.Requests.Panels;

public class CreateManyPanelsRequest : IProjectEventRequest
{
    public required string ProjectId { get; set; } = default!;
    public required string StringId { get; set; } = default!;
    public required string PanelConfigId { get; set; } = default!;
    public required int Angle { get; set; } = 0;

    public required IEnumerable<MinimalCreatePanelRequest> Panels { get; init; } =
        new List<MinimalCreatePanelRequest>();
}

public class MinimalCreatePanelRequest
{
    public required string Id { get; init; }
    public required Panel.Point Location { get; init; }
    public required int Angle { get; init; }
}

public class CreateManyPanelsRequestValidator : AbstractValidator<CreateManyPanelsRequest>
{
    public CreateManyPanelsRequestValidator()
    {
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

        RuleFor(v => v.Panels)
            .NotNull()
            .WithMessage("Panels cannot be null")
            .Must(CheckPanels)
            .WithMessage("Panels must have valid id and location and angle")
            .NotEmpty()
            .WithMessage("Panels cannot be empty");
    }

    private bool CheckPanels(IEnumerable<MinimalCreatePanelRequest> panels)
    {
        bool CheckId(string id)
        {
            return !string.IsNullOrWhiteSpace(id) && Guid.TryParse(id, out _);
        }

        bool CheckLocation(Panel.Point location)
        {
            // return location.X >= 0 && location.Y >= 0;
            return true;
        }

        bool CheckAngle(int angle)
        {
            return angle >= 0 && angle <= 360;
        }

        return panels.All(x => CheckId(x.Id) && CheckLocation(x.Location) && CheckAngle(x.Angle));
    }
}