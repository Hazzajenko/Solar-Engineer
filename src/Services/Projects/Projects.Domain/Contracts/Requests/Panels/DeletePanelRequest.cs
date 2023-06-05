using FluentValidation;
using Projects.Domain.Common;

namespace Projects.Domain.Contracts.Requests.Panels;

public class DeletePanelRequest : IProjectEventRequest
{
    public required string ProjectId { get; set; }
    public required string PanelId { get; init; }
}

public class DeletePanelRequestValidator : AbstractValidator<DeletePanelRequest>
{
    public DeletePanelRequestValidator()
    {
        RuleFor(v => v.ProjectId)
            .NotNull()
            .WithMessage("ProjectId cannot be null")
            .NotEmpty()
            .WithMessage("ProjectId cannot be empty")
            .Must(x => Guid.TryParse(x, out _))
            .WithMessage("ProjectId must be a valid Guid");

        RuleFor(v => v.PanelId)
            .NotNull()
            .WithMessage("Id cannot be null")
            .NotEmpty()
            .WithMessage("Id cannot be empty")
            .Must(x => Guid.TryParse(x, out _))
            .WithMessage("Id must be a valid Guid");
    }
}