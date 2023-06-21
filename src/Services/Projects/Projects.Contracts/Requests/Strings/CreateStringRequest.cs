namespace Projects.Contracts.Requests.Strings;

public class CreateStringRequest : IProjectEventRequest
{
    public required string ProjectId { get; init; }
    public required StringModel String { get; init; } = default!;
    public IEnumerable<PanelUpdate> PanelUpdates { get; init; } = default!;

    public class StringModel
    {
        public required string Id { get; init; }
        public required string Name { get; init; }
        public required string Colour { get; init; }
        public bool Parallel { get; set; } = false;
    }
}

public class CreateStringRequestValidator : AbstractValidator<CreateStringRequest>
{
    public CreateStringRequestValidator()
    {
        RuleFor(v => v.String.Id)
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

        RuleFor(v => v.String.Name)
            .NotNull()
            .WithMessage("Name cannot be null")
            .NotEmpty()
            .WithMessage("Name cannot be empty");

        RuleFor(v => v.PanelUpdates)
            .NotNull()
            .WithMessage("PanelIds cannot be null")
            .NotEmpty()
            .WithMessage("PanelIds cannot be empty");

        RuleForEach(v => v.PanelUpdates)
            .NotNull()
            .WithMessage("Panel cannot be null")
            .NotEmpty()
            .WithMessage("Panel cannot be empty")
            .Must(x => x.Changes.StringId is not null)
            .WithMessage("Panel must have the a StringId in Changes")
            .Must(x => Guid.TryParse(x.Id, out _))
            .WithMessage("PanelId must be a valid Guid");
    }
}