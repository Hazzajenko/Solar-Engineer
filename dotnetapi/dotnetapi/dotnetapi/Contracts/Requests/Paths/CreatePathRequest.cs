using System.ComponentModel.DataAnnotations;

namespace dotnetapi.Contracts.Requests.Paths;

public class CreatePathRequest
{
    [Required] public string Id { get; init; } = default!;
    [Required] public string StringId { get; init; } = default!;
    [Required] public string PanelId { get; init; } = default!;
    [Required] public int Link { get; init; }
    [Required] public int Count { get; init; }
    [Required] public string Color { get; init; } = default!;
}