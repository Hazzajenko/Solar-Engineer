using Infrastructure.SignalR;

namespace Projects.Domain.Queries.Projects;

public sealed record GetProjectByIdQuery(HubAppUser User, string ProjectId) : IQuery<bool>;