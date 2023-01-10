using System.ComponentModel.DataAnnotations;

namespace dotnetapi.Contracts.Requests.Paths;

public class UpdatePathRequest
{
    [Required] public string Id { get; set; } = default!;

    [Required] public UpdatePath Changes { get; set; } = default!;
}

public abstract class UpdatePath
{
    public string? StringId { get; set; } = default!;
    public string? PanelId { get; set; } = default!;
    public int? Link { get; set; }
    public int? Count { get; set; }
    public string? Color { get; set; } = default!;
}