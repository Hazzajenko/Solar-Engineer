using System.ComponentModel.DataAnnotations;

namespace dotnetapi.Contracts.Requests;

public class CreateStringRequest
{
    [Required] public string Id { get; init; } = default!;
    [Required] public string Name { get; init; } = default!;
    [Required] public string Color { get; init; } = default!;
}

public class UpdateStringRequest
{
    [Required] public int ProjectId { get; init; } = default!;
    [Required] public string Id { get; init; } = default!;
    public bool? IsInParallel { get; set; }
    public string? Name { get; set; } = default!;
    public string? Color { get; set; } = default!;
}