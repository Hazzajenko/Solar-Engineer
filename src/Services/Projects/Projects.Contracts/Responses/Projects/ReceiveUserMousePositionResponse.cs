namespace Projects.Contracts.Responses.Projects;

public class ReceiveUserMousePositionResponse
{
    public string ProjectId { get; set; } = default!;
    public string UserId { get; set; } = default!;
    public double X { get; set; } = default!;
    public double Y { get; set; } = default!;
}
