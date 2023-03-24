using FluentValidation;

namespace Projects.Domain.Contracts.Requests.Projects;

public class NewProjectEventRequest
{
    public required string RequestId { get; init; }
    public required string ProjectId { get; init; }
    public required string Action { get; init; }
    public required string Model { get; init; }
    public required string Data { get; init; }
}

public class NewProjectEventRequestValidator : AbstractValidator<NewProjectEventRequest>
{
    public NewProjectEventRequestValidator()
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

        RuleFor(v => v.Action)
            .NotNull()
            .WithMessage("Action cannot be null")
            .NotEmpty()
            .WithMessage("Action cannot be empty");

        RuleFor(v => v.Model)
            .NotNull()
            .WithMessage("Model cannot be null")
            .NotEmpty()
            .WithMessage("Model cannot be empty");

        RuleFor(v => v.Data)
            .NotNull()
            .WithMessage("Data cannot be null")
            .NotEmpty()
            .WithMessage("Data cannot be empty");
    }
}