using MessagePack;

namespace Projects.Contracts.Requests.Projects;

// [MessagePackObject(keyAsPropertyName: true)]
public class CreateProjectRequest
{
    // [Key("name")]
    public string Name { get; set; } = default!;

    // [Key("colour")]
    public string Colour { get; set; } = default!;

    // [Key("memberIds")]
    public IEnumerable<string> MemberIds { get; set; } = default!;
}

public class CreateProjectRequestValidator : AbstractValidator<CreateProjectRequest>
{
    public CreateProjectRequestValidator()
    {
        RuleFor(v => v.Name)
            .NotNull()
            .WithMessage("Name cannot be null")
            .NotEmpty()
            .WithMessage("Name cannot be empty");
        RuleFor(v => v.Colour)
            .NotNull()
            .WithMessage("Colour cannot be null")
            .NotEmpty()
            .WithMessage("Colour cannot be empty");
        RuleForEach(v => v.MemberIds)
            .NotNull()
            .WithMessage("MemberId cannot be null")
            .NotEmpty()
            .WithMessage("MemberId cannot be empty");
    }
}
