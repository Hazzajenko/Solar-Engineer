using Infrastructure.Extensions;

namespace Projects.Contracts.Requests.Projects;

public class RejectProjectInviteRequest : IProjectRequest
{
    public string ProjectId { get; set; } = default!;

    public string NotificationId { get; set; } = default!;
}
