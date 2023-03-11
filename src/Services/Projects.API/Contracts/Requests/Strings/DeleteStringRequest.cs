using FluentValidation;
using Projects.API.Common;

namespace Projects.API.Contracts.Requests.Strings;

public class DeleteStringRequest : IProjectEventRequest
{
    public required string Id { get; init; }
}

public class DeleteStringRequestValidator : AbstractValidator<DeleteStringRequest>
{
    public DeleteStringRequestValidator()
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