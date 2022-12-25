using dotnetapi.Models.Dtos.Projects;

namespace dotnetapi.Contracts.Responses;

public class OneStringResponse
{
    public StringDto String { get; set; } = default!;
}

public class ManyStringsResponse
{
    public IEnumerable<StringDto> Strings { get; init; } = Enumerable.Empty<StringDto>();
}