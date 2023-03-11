using FluentValidation;
using Projects.API.Common;

namespace Projects.API.Contracts.Requests.Strings;

public class CreateStringRequest : IProjectEventRequest
{
    public required string Id { get; init; }
    public required string ProjectId { get; init; }
    public required string Name { get; init; }
    public string Color { get; init; } = "blue";

    /*public class Create
    {
        public required string Id { get; init; }
        public required string ProjectId { get; init; }
        public required string Name { get; init; }
        public string Color { get; init; } = "blue";
    }*/
}

/*public class StringCreate
{
    public required string Id { get; init; }
    public required string ProjectId { get; init; }
    public required string Name { get; init; }
    public string Color { get; init; } = "blue";
}*/

public class CreateStringRequestValidator : AbstractValidator<CreateStringRequest>
{
    public CreateStringRequestValidator()
    {
        RuleFor(v => v.Id)
            .NotNull()
            .WithMessage("Id cannot be null")
            .NotEmpty()
            .WithMessage("Id cannot be empty")
            .Must(x => Guid.TryParse(x, out _))
            .WithMessage("Id must be a valid Guid");

        RuleFor(v => v.ProjectId)
            .NotNull()
            .WithMessage("ProjectId cannot be null")
            .NotEmpty()
            .WithMessage("ProjectId cannot be empty")
            .Must(x => Guid.TryParse(x, out _))
            .WithMessage("ProjectId must be a valid Guid");

        RuleFor(v => v.Name)
            .NotNull()
            .WithMessage("Name cannot be null")
            .NotEmpty()
            .WithMessage("Name cannot be empty");
    }
}