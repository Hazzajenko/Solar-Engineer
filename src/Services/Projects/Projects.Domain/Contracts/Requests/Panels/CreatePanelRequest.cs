using FluentValidation;
using Projects.Domain.Common;
using Projects.Domain.Entities;

namespace Projects.Domain.Contracts.Requests.Panels;

public class CreatePanelRequest : IProjectEventRequest
{
    public required string ProjectId { get; init; }
    public required PanelObject Panel { get; init; }


    /*public required string Id { get; init; }
    public required string StringId { get; init; }
    public required Panel.Point Location { get; init; }
    public required string PanelConfigId { get; init; }
    public required double Angle { get; init; }*/
}

public class PanelObject
{
    public required string Id { get; init; }
    public required string StringId { get; init; }
    public required string PanelConfigId { get; init; }
    public required Panel.Point Location { get; init; }
    public required double Angle { get; init; }
}

public class CreatePanelRequestValidator : AbstractValidator<CreatePanelRequest>
{
    public CreatePanelRequestValidator()
    {
        RuleFor(v => v.Panel.Id)
            .NotNull()
            .WithMessage("Id cannot be null")
            .NotEmpty()
            .WithMessage("Id cannot be empty")
            .Must(x => Guid.TryParse(x, out _))
            .WithMessage("Id must be a valid Guid");

        /*RuleFor(v => v.ProjectId)
            .NotNull()
            .WithMessage("ProjectId cannot be null")
            .NotEmpty()
            .WithMessage("ProjectId cannot be empty")
            .Must(x => Guid.TryParse(x, out _))
            .WithMessage("ProjectId must be a valid Guid");*/

        RuleFor(v => v.Panel.Location)
            .NotNull()
            .WithMessage("Location cannot be null")
            .NotEmpty()
            .WithMessage("Location cannot be empty")
            .Must(CheckLocation)
            .WithMessage("Location must be a valid location");

        RuleFor(v => v.Panel.Angle)
            .NotNull()
            .WithMessage("Angle cannot be null")
            .NotEmpty()
            .WithMessage("Angle cannot be empty")
            .Must(CheckAngle)
            .WithMessage("Angle must be a valid angle");
    }

    private bool CheckLocation(Panel.Point location)
    {
        // return location.X >= 0 && location.Y >= 0;
        return true;
    }

    private bool CheckAngle(double angle)
    {
        // return angle >= 0 && angle <= 360;
        return true;
    }
}