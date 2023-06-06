using Infrastructure.Authentication;
using Projects.Contracts.Data;

namespace Projects.SignalR.Queries.Projects;

public sealed record GetUserProjectsQuery(AuthUser User) : IQuery<IEnumerable<ProjectDto>>;