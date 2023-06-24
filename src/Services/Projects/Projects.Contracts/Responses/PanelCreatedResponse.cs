
using Projects.Contracts.Data;


namespace Projects.Contracts.Responses;

public class PanelCreatedResponse
{
    public string RequestId { get; set; } = default!;
    public string ProjectId { get; set; } = default!;
    public DateTime Time { get; set; } = DateTime.UtcNow;
    public string ByAppUserId { get; set; } = default!;
    public bool IsSuccess { get; set; } = true;
    public string? Error { get; set; }
    public string Action { get; set; } = "Create";
    public string Model { get; set; } = "Panel";
    public PanelDto Create { get; set; } = default!;
}