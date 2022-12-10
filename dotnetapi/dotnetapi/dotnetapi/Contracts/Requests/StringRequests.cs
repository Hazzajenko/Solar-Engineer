using System.ComponentModel.DataAnnotations;

namespace dotnetapi.Contracts.Requests;

public class CreateStringRequest
{
    [Required] public string Id { get; init; } = default!;
    [Required] public string Name { get; init; } = default!;
}

public class UpdateStringRequest
{
    [Required] public int ProjectId { get; init; } = default!;
    [Required] public string Id { get; init; } = default!;
    public string? Name { get; set; } = default!;
}