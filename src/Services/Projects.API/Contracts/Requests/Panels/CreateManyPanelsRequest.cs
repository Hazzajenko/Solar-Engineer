using FluentValidation;
using Projects.API.Common;

namespace Projects.API.Contracts.Requests.Panels;

public class CreateManyPanelsRequest : IProjectEventRequest
{
    public required string ProjectId { get; set; } = default!;
    public required string StringId { get; set; } = default!;
    public required string PanelConfigId { get; set; } = default!;
    public required int Rotation { get; set; } = 0;

    public required IEnumerable<MinimalCreatePanelRequest> Panels { get; init; } =
        new List<MinimalCreatePanelRequest>();
}

public class MinimalCreatePanelRequest
{
    public required string Id { get; init; }
    public required string Location { get; init; }
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
            .Must(CheckPanels)
            .WithMessage("Panels must have valid id and location")
            .NotEmpty()
            .WithMessage("Panels cannot be empty");
    }

    private bool CheckPanels(IEnumerable<MinimalCreatePanelRequest> panels)
    {
        bool CheckId(string id)
        {
            return !string.IsNullOrWhiteSpace(id) && Guid.TryParse(id, out _);
        }

        bool CheckLocation(string location)
        {
            return !string.IsNullOrWhiteSpace(location)
                   && location.Contains("row")
                   && location.Contains("col");
        }

        return panels.All(x => CheckId(x.Id) && CheckLocation(x.Location));
    }
}