using Projects.Contracts.Requests.Panels;

namespace Projects.Contracts.Requests.ProjectItems;

public class CreateProjectItemRequest
{
    public string Type { get; set; } = default!;
    public string Name { get; set; } = default!;
    public CreatePanelRequest? Panel { get; set; }
}

public class CreateProjectItemRequestValidator : AbstractValidator<CreateProjectItemRequest>
{
    public CreateProjectItemRequestValidator()
    {
        RuleFor(v => v.Type)
            .NotNull()
            .WithMessage("Type cannot be null")
            .NotEmpty()
            .WithMessage("Type cannot be empty");

        RuleFor(v => v.Name)
            .NotNull()
            .WithMessage("Name cannot be null")
            .NotEmpty()
            .WithMessage("Name cannot be empty");
    }
}