using FluentValidation;
using Projects.API.Common;

namespace Projects.API.Contracts.Requests.Panels;

public class CreateManyPanelsRequest : IProjectEventRequest
{
    public required string ProjectId { get; set; } = default!;
    public required string StringId { get; set; } = default!;
    public required string PanelConfigId { get; set; } = default!;


    public required IEnumerable<CreatePanelRequest> Panels { get; init; } =
        new List<CreatePanelRequest>();
}

public class CreateManyPanelsRequestValidator : AbstractValidator<CreateManyPanelsRequest>
{
    public CreateManyPanelsRequestValidator()
    {
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

        RuleFor(v => v.Panels)
            .NotNull()
            .WithMessage("Panels cannot be null")
            .NotEmpty()
            .WithMessage("Panels cannot be empty");
    }
}