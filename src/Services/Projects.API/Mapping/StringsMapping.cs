using Projects.API.Contracts.Data;

namespace Projects.API.Mapping;

public static class StringsMapping
{
    public static StringDto ToDto(this String @string)
    {
        return new StringDto
        {
            Name = @string.Name,
            Color = @string.Color,
            Parallel = @string.Parallel,
            Id = @string.Id.ToString(),
            ProjectId = @string.ProjectId.ToString(),
            CreatedTime = @string.CreatedTime,
            LastModifiedTime = @string.LastModifiedTime,
            CreatedById = @string.CreatedById.ToString()
        };
    }

    public static IEnumerable<StringDto> ToDtoList(this String @string)
    {
        return new List<StringDto> { @string.ToDto() };
    }
}