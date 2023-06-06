namespace Projects.Contracts.Responses;

public class ProjectEventResponse
{
    public string RequestId { get; set; } = default!;
    public string ProjectId { get; set; } = default!;
    public DateTime ServerTime { get; set; } = DateTime.UtcNow;
    public string ByAppUserId { get; set; } = default!;
    public bool IsSuccess { get; set; } = true;
    public string? Error { get; set; }
    public string Action { get; set; } = default!;
    public string Model { get; set; } = default!;
    public string Data { get; set; } = default!;
}