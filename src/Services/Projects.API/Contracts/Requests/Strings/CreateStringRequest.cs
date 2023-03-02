using FluentValidation;

namespace Projects.API.Contracts.Requests.Strings;

public class CreateStringRequest
{
    public required string Id { get; init; } = default!;
    public required string Name { get; init; } = default!;
    public string Color { get; init; } = "blue";
}

public class CreateStringRequestValidator : AbstractValidator<CreateStringRequest>
{
    public CreateStringRequestValidator()
    {
        RuleFor(v => v.Id)
            .NotNull()
            .WithMessage("Id cannot be null")
            .NotEmpty()
            .WithMessage("Id cannot be empty");

        RuleFor(v => v.Name)
            .NotNull()
            .WithMessage("Name cannot be null")
            .NotEmpty()
            .WithMessage("Name cannot be empty");
    }
}