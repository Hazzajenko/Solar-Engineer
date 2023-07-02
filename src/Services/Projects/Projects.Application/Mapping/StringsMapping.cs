using ApplicationCore.Extensions;
using Projects.Contracts.Data;

namespace Projects.Application.Mapping;

public static class StringsMapping
{
    public static StringDto ToDto(this String @string)
    {
        return new StringDto
        {
            Name = @string.Name,
            Colour = @string.Colour,
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

    public static String ToEntity(
        this StringTemplateItem stringTemplateItem,
        Guid projectId,
        Guid createdById
    )
    {
        return String.Create(
            (stringTemplateItem.Id, stringTemplateItem.Name, stringTemplateItem.Colour),
            projectId,
            createdById
        );
    }

    public static IEnumerable<String> ToEntityList(
        this IEnumerable<StringTemplateItem> stringTemplateItems,
        Guid projectId,
        Guid createdById
    )
    {
        return stringTemplateItems.Select(x => x.ToEntity(projectId, createdById));
    }

    public static String ToEntity(this StringDto stringDto, Guid projectId, Guid createdById)
    {
        return String.Create(
            (stringDto.Id, stringDto.Name, stringDto.Colour),
            projectId,
            createdById
        );
    }
}
