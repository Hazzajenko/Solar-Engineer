using FluentValidation;
using Projects.Domain.Common;

namespace Projects.Domain.Contracts.Requests.Panels;

public class DeletePanelRequest : IProjectEventRequest
{
    public required string Id { get; init; }
}

public class DeletePanelRequestValidator : AbstractValidator<DeletePanelRequest>
{
    public DeletePanelRequestValidator()
    {
        RuleFor(v => v.Id)
            .NotNull()
            .WithMessage("Id cannot be null")
            .NotEmpty()
            .WithMessage("Id cannot be empty")
            .Must(x => Guid.TryParse(x, out _))
            .WithMessage("Id must be a valid Guid");
    }
}