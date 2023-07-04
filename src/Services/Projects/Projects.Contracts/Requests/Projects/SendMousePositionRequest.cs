using Infrastructure.Extensions;

namespace Projects.Contracts.Requests.Projects;

public class SendMousePositionRequest
{
    public string ProjectId { get; set; } = default!;
    public double X { get; set; } = default!;
    public double Y { get; set; } = default!;
}
