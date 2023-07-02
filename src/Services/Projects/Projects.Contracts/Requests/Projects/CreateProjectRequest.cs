using System.Text.Json.Serialization;
using Ardalis.SmartEnum.SystemTextJson;
using MessagePack;
using Projects.Contracts.Data;

namespace Projects.Contracts.Requests.Projects;

public class CreateProjectRequest
{
    public string Name { get; set; } = default!;
    public string Colour { get; set; } = default!;
    public IEnumerable<string> MemberIds { get; set; } = default!;

    [JsonConverter(typeof(SmartEnumNameConverter<ProjectTemplateKey, int>))]
    public ProjectTemplateKey TemplateType { get; set; } = default!;
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
