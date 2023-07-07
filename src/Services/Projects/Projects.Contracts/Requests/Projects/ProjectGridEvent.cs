﻿namespace Projects.Contracts.Requests.Projects;

public class ProjectGridEvent : IProjectRequest
{
    public required string RequestId { get; set; }
    public required string ProjectId { get; set; }
    public required string Action { get; set; }
    public required string Model { get; set; }
    public required string Data { get; set; }
}

public class ProjectsEventRequestValidator : AbstractValidator<ProjectGridEvent>
{
    public ProjectsEventRequestValidator()
    {
        RuleFor(v => v.RequestId)
            .NotNull()
            .WithMessage("RequestId cannot be null")
            .NotEmpty()
            .WithMessage("RequestId cannot be empty")
            .Must(x => Guid.TryParse(x, out _))
            .WithMessage("RequestId must be a valid Guid");

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
