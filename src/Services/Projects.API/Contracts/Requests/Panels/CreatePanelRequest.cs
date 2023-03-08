using FluentValidation;
using Projects.API.Common;

namespace Projects.API.Contracts.Requests.Panels;

public class CreatePanelRequest : ICreateRequest<PanelCreate>
{
    public required string RequestId { get; init; }
    public required string ProjectId { get; init; }
    public required PanelCreate Create { get; init; }
}

/*public class PanelCreate
{
    public required string Id { get; init; }
    public required string ProjectId { get; init; }
    public required string StringId { get; init; }
    public required string Location { get; init; }
    public required string PanelConfigId { get; init; }
    public required int Rotation { get; init; } = 0;
}*/
/*
public class PanelCreate
{
    public required string Id { get; init; }
    public required string ProjectId { get; init; }
    public required string StringId { get; init; }
    public required string Location { get; init; }
    public required string PanelConfigId { get; init; }
    public required int Rotation { get; init; } = 0;
}*/

public class CreatePanelRequestValidator : AbstractValidator<CreatePanelRequest>
{
    public CreatePanelRequestValidator()
    {
        RuleFor(v => v.RequestId)
            .NotNull()
            .WithMessage("SignalrRequestId cannot be null")
            .NotEmpty()
            .WithMessage("SignalrRequestId cannot be empty")
            .Must(x => Guid.TryParse(x, out _))
            .WithMessage("SignalrRequestId must be a valid Guid");

        RuleFor(v => v.ProjectId)
            .NotNull()
            .WithMessage("ProjectId cannot be null")
            .NotEmpty()
            .WithMessage("ProjectId cannot be empty")
            .Must(x => Guid.TryParse(x, out _))
            .WithMessage("ProjectId must be a valid Guid");

        RuleFor(v => v.Create.Id)
            .NotNull()
            .WithMessage("Id cannot be null")
            .NotEmpty()
            .WithMessage("Id cannot be empty")
            .Must(x => Guid.TryParse(x, out _))
            .WithMessage("Id must be a valid Guid");

        RuleFor(v => v.Create.ProjectId)
            .NotNull()
            .WithMessage("ProjectId cannot be null")
            .NotEmpty()
            .WithMessage("ProjectId cannot be empty");

        RuleFor(v => v.Create.StringId)
            .NotNull()
            .WithMessage("StringId cannot be null")
            .NotEmpty()
            .WithMessage("StringId cannot be empty");

        RuleFor(v => v.Create.Location)
            .NotNull()
            .WithMessage("Location cannot be null")
            .NotEmpty()
            .WithMessage("Location cannot be empty");

        RuleFor(v => v.Create.Rotation)
            .NotNull()
            .WithMessage("Rotation cannot be null")
            .NotEmpty()
            .WithMessage("Rotation cannot be empty")
            .Must(r => r is >= 0 and <= 2)
            .WithMessage("Rotation cannot more than 1");
    }
}