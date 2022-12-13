using System.ComponentModel.DataAnnotations;

namespace dotnetapi.Contracts.Requests;

public class CreatePanelLinkRequest
{
    [Required] public string Id { get; init; } = default!;
    [Required] public string StringId { get; init; } = default!;
    [Required] public string PositiveToId { get; init; } = default!;
    [Required] public string NegativeToId { get; init; } = default!;
    public bool IsDisconnectionPoint { get; set; }
    public string? DisconnectionPointPanelId { get; set; } = default!;
}

public class DeletePanelLinkRequest
{
    [Required] public string Id { get; set; } = default!;
}