using dotnetapi.Models.Dtos;

namespace dotnetapi.Contracts.Responses;

public class OneStringResponse
{
    public StringDto String { get; set; } = default!;
}

public class ManyStringsResponse
{
    public IEnumerable<StringDto> Strings { get; init; } = Enumerable.Empty<StringDto>();
}