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
        RuleFor(v => v.ProjectId)
            .NotNull()
            .WithMessage("ProjectId cannot be null")
            .NotEmpty()
            .WithMessage("ProjectId cannot be empty")
            .Must(x => Guid.TryParse(x, out _))
            .WithMessage("ProjectId must be a valid Guid");
    }
}