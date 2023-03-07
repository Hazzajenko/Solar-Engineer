using Infrastructure.Common;
using Projects.API.Contracts.Data;
using Projects.API.Entities;

namespace Projects.API.Contracts.Responses;

public class PanelCreatedResponse : IMappable<Panel>
{
    public string SignalrRequestId { get; set; } = default!;
    public string ProjectId { get; set; } = default!;
    public DateTime Time { get; set; } = DateTime.UtcNow;
    public string ByAppUserId { get; set; } = default!;
    public bool IsSuccess { get; set; } = true;
    public string? Error { get; set; }
    public PanelDto Panel { get; set; } = default!;
}